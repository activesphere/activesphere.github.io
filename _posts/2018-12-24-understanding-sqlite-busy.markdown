---
title: Understanding SQLITE_BUSY
author: rahul
hidden: true
---

I recently stumbled upon a [strange occurrence](https://github.com/sequelize/sequelize/issues/10262) in an ORM's query retry implementation for [SQLite](https://www.sqlite.org/index.html). Some of my queries were getting stuck in a retry loop and eventually failing with [SQLITE_BUSY](https://www.sqlite.org/rescode.html#busy) errors, on hitting max retry limits. While debugging the problem, it helped to understand `SQLITE_BUSY` better, by going through different parts of the official documentation and drawing parallels to some well-understood concepts[^1]. I'm writing this post hoping that my high-level understanding, and refs/pointers to SQLite docs, might help others debugging similar issues.

## When does it happen

SQLite allows concurrent transactions by letting clients open multiple connections[^2] to the database. Concurrent transactions may cause race conditions though, leading to inconsistent data. To prevent this, databases usually provide [some guarantees](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Isolation_levels>) to protect against race conditions. SQLite guarantees that concurrent transactions are completely isolated[^3] ([serializable isolation](https://en.wikipedia.org/wiki/Serializability)), meaning the outcome of concurrent transactions will be as if they were executed in serial order.

To prevent violation of this isolation guarantee, and to preserve the integrity of the database, SQLite rejects some queries with `SQLITE_BUSY` errors. It's left to the user to decide how to retry failed queries (discussed further towards the end).

Let's look at algorithms used to implement this isolation.

## Serial execution

<figure class="layout__aside" id="serial">
  <div class="layout__aside-content">
    <img src="/public/images/serial_execution.svg">
  </div>
</figure>

One way to achieve serializable isolation is to allow only one transaction at a time while blocking others.

Transactions can exhibit one of three [behaviours](https://www.sqlite.org/lang_transaction.html). `DEFERRED` (default) or `IMMEDIATE` or `EXCLUSIVE`

```sql
BEGIN DEFERRED; /* or IMMEDIATE or EXCLUSIVE */
/* ...  Some SQL read and write statements */
COMMIT;
```

`IMMEDIATE` and `EXCLUSIVE` behaviours acquire locks at the beginning of a transaction. In these modes, once a transaction acquires a lock, other concurrent transactions trying to acquire a lock, would fail with a `SQLITE_BUSY` error. This enforces serial (one transaction at a time) execution. But running only one transaction at a time, might not be performant.

`DEFERRED` behaviour, on the other hand, allows multiple transactions to run concurrently. This means that queries from multiple transactions can get interleaved leading to race conditions.

SQLite needs to make sure that even in `DEFERRED` mode, outcome of concurrent transactions seem as if they're executed in serial order, to clients. Let's look at how isolation is implemented for concurrent ops in `DEFERRED` transaction.

## Atomic commit

To implement isolation, there needs to be some way to undo changes done by a transaction, if it violates isolation. SQLite uses a journal for implementing [atomic commit & rollback](https://www.sqlite.org/atomiccommit.html), which ensures that if isolation is violated or the application crashes in between a transaction, the database can get back to its previous state. For the purposes of this post, we'll look at the two[^5] journaling modes it supports. [Rollback](https://www.sqlite.org/lockingv3.html#rollback) & [WAL](https://www.sqlite.org/wal.html). The algorithm to implement isolation differs for both of these journal modes.

## Rollback journal and 2PL

<figure class="layout__aside" id="rollback">
  <div class="layout__aside-content">
    <img src="/public/images/rollback.svg">
  </div>
</figure>

In this mode, locks are used to implement isolation. Transaction wanting to read acquires a `SHARED` lock. Multiple transactions can hold this lock simultaneously. If another transaction is writing, readers fail with `SQLITE_BUSY`. Transaction wanting to write acquires an `EXCLUSIVE` lock. Only one transaction can hold this lock at a time, others fail with `SQLITE_BUSY`. A transaction may upgrade it's `SHARED` lock to an `EXCLUSIVE` lock to write after a read, but not vice versa. Once a transaction acquires a lock, it must hold it until the end of the transaction. There are some more intermediate locks, which I have skipped for simplicity. More details can be found [here](https://www.sqlite.org/lockingv3.html)

<details><summary>Implementation details</summary>
  <blockquote>
    <p>In rollback mode, SQLite implements isolation by locking the database file and preventing any reads by other database connections while each write transaction is underway. Readers can be active at the beginning of a write before any content is flushed to disk and while all changes are still held in the writer's private memory space. But before any changes are made to the database file on disk, all readers must be (temporally) expelled in order to give the writer exclusive access to the database file. Hence, readers are prohibited from seeing incomplete transactions by virtue of being locked out of the database while the transaction is being written to disk. Only after the transaction is completely written and synced to disk and commits are the readers allowed back into the database. Hence readers never get a chance to see partially written changes.</p>
    <p>Source: https://www.sqlite.org/isolation.html</p>
  </blockquote>
</details>

This locking algorithm is commonly called [Two-phase locking (2PL)](https://en.wikipedia.org/wiki/Two-phase_locking).

## WAL and SSI

Another journal mode which SQLite supports is [WAL](https://www.sqlite.org/wal.html). It's considered to be significantly faster than rollback in most scenarios[^4].

<figure class="layout__aside" id="snapshot">
  <div class="layout__aside-content">
    <img src="/public/images/snapshot.svg">
  </div>
</figure>

> WAL mode permits simultaneous readers and writers. It can do this because changes do not overwrite the original database file, but rather go into the separate write-ahead log file. That means that readers can continue to read the old, original, unaltered content from the original database file at the same time that the writer is appending to the write-ahead log. In WAL mode, SQLite exhibits "snapshot isolation". When a read transaction starts, that reader continues to see an unchanging "snapshot" of the database file as it existed at the moment in time when the read transaction started. Any write transactions that commit while the read transaction is active are still invisible to the read transaction because the reader is seeing a snapshot of database file from a prior moment in time.

> Source: https://www.sqlite.org/isolation.html

This is similar to [serializable snapshot isolation(SSI)](https://wiki.postgresql.org/wiki/SSI) as implemented in PostgreSQL.

Instead of acquiring a lot of locks like 2PL, a transaction continues hoping that everything will turn out all right. When a transaction performs a read eventually followed by a write and tries to commit, SQLite checks if database was changed after the transaction finished reading. If yes, the transaction fails with a [BUSY_SNAPSHOT](https://www.sqlite.org/rescode.html#busy_snapshot) error and has to be re-tried.

It's important to note that `BUSY_SNAPSHOT` is an [extended error code](https://www.sqlite.org/rescode.html#pve). It is disabled by default and will show up as a `SQLITE_BUSY` error instead.

## Locks used in WAL

In `WAL`, there are some cases where locks are used and one might see `SQLITE_BUSY` errors.

### Single writer

SQLite supports only one writer at a time.

> When any process wants to write, it must lock the entire database file for the duration of its update. But that normally only takes a few milliseconds.

When SQLite tries to access a file that is locked by another process, the default behaviour is to return `SQLITE_BUSY`.

Use of [exclusive locking mode](https://www.sqlite.org/pragma.html#pragma_locking_mode) by a database connection also causes `SQLITE_BUSY` errors for others. It's used in a couple of scenarios.

<details><summary>Show scenarios</summary>

<h3>Checkpointing</h3>

<blockquote>
<p>When the last connection to a particular database is closing, that connection will acquire an exclusive lock for a short time while it cleans up the WAL and shared-memory files. If a second database tries to open and query the database while the first connection is still in the middle of its cleanup process, the second connection might get an SQLITE_BUSY error.</p>
</blockquote>

<p>`EXCLUSIVE` locking mode is used to transfer data from WAL back to the original database. See [checkpointing](https://www.sqlite.org/wal.html#checkpointing) for more details.</p>

<h3>Recovery</h3>

<blockquote>
> If the last connection to a database crashed, then the first new connection to open the database will start a recovery process. An exclusive lock is held during recovery. So if a third database connection tries to jump in and query while the second connection is running recovery, the third connection will get an SQLITE_BUSY error.
</blockquote>

</details>

## Retry

`SQLITE_BUSY` errors can pop up in between a transaction (apart from `IMMEDIATE`/`EXCLUSIVE` modes where transaction fails at the beginning itself). In such cases, there are 2 ways to automatically retry. Re-try just the problematic query, or `ROLLBACK` and re-try the entire transaction.

Re-trying individual queries would be faster, but will not always succeed. One example is in `WAL` mode's `BUSY_SNAPSHOT` error scenario. The isolation guarantee will not allow the transaction to commit with a stale read and just re-trying the query after some time will not help. The entire transaction needs to be re-tried with a fresh snapshot by re-doing the select queries.

Let's look at another case below.

## Deadlocks

<figure class="layout__aside" id="deadlock">
  <div class="layout__aside-content">
    <img src="/public/images/deadlock.svg">
  </div>
</figure>

The 2PL algorithm is susceptible to deadlocks, where concurrent transactions block each other & can't make progress. Consider the scenario in the figure.

Both transactions acquire a `SHARED` lock while reading. First `Transaction1` starts the process to acquire an `EXCLUSIVE` lock with a write query. But, it can't commit till there are other `SHARED` locks. `Transaction2` can't acquire `EXCLUSIVE` lock since `Transaction1` is trying to acquire it. Both Transactions can't make progress. Remember that in 2PL, transactions need to hold the lock till they either commit or abort. Simply waiting and retrying the query doesn't help. To make progress, one of them has to give up and abort.

SQLite provides a [busy_handler](https://www.sqlite.org/c3ref/busy_handler.html) for automatically re-trying individual queries. It's capable of detecting deadlocks and immediately failing with `SQLITE_BUSY`. From its documentation

> The presence of a busy handler does not guarantee that it will be invoked when there is lock contention. If SQLite determines that invoking the busy handler could result in a deadlock, it will go ahead and return SQLITE_BUSY to the application instead of invoking the busy handler

With `busy_handler` configured, Transaction2 yields it's `SHARED` lock & fails with `SQLITE_BUSY`. Transaction1 succeeds.

If a query fails with busy_handler configured, one might assume that either transaction can't make progress due to deadlock, is trying to commit with stale snapshot or has timed out. The transaction will have to be rolled back & re-tried at the application level.

## Conclusion

Let's go back to the problem with the ORM's query retry module, that I described at the start. In that situation, transactions used `DEFERRED` behaviour by default and ended up in deadlock and `BUSY_SNAPSHOT` error scenarios (I experimented with both rollback & WAL modes). The ORM implemented it's own query level retry mechanism, which couldn't detect these cases. It ended up re-trying the deadlocked query a bunch of times before eventually failing.

To solve the problem, I could have disabled ORM's retry, configured `busy_handler` for query re-tries and implemented my own transaction level retry. But instead, as a quick fix, I started transactions in `IMMEDIATE` behaviour, using a global configuration option the ORM provided. This moved `SQLITE_BUSY` errors to the beginning of transactions, allowing me to re-use the ORM's query retry module to retry transactions (possibly at the expense of performance, but I was ok with that tradeoff).

### References:

- Chapter 7, [Designing Data-Intensive Applications](https://dataintensive.net/)
- [SQLite documentation](https://www.sqlite.org/docs.html)

[^1]: Algorithms like Two-Phase locking and guarantees like Serializable Snapshot Isolation have well-researched properties and side effects. Drawing parallels helped me identify SQLite side effects like deadlocks & stale snapshots faster.

[^2]: Since there's no [isolation](https://www.sqlite.org/isolation.html) between ops on the same connection.

[^3]: Except in the case of shared cache database connections with PRAGMA read_uncommitted turned on

[^4]: Source: https://www.sqlite.org/wal.html

[^5]: Rollback mode may be further subdivided into more types, which instruct SQLite on how to get rid of rollback journal on completion of transaction. Source: https://www.sqlite.org/pragma.html#pragma_journal_mode
