---
title: Things we don't like about Couchdb
published: true
hidden: true
author: Sreekanth
categories:
- couchdb
- databases
- nosql
---

We love Couchdb, it is a workhorse, and we use it on a lot of
projects. Obviously it does not fit everywhere. There are some places
where it just does not cut it. I am trying to document a few issues
we've been having with couchdb.


**Building Views**

Views are built at run request time. We think that should be an option
- there should be a way to amortise the cost of building views either
when adding documents or at usage time. We get a load of documents
everyday into the system, and for a while we watched the system come
to a grinding halt while the first request indexed the views, some
other times the view request returns timeout.

The problem here is that when a view is being built it just blocks any
operation on that design document, which means other requests are
blocked as well (unless they go to a different design doc).

We work around this problem by pre-warming all the instances, after
the documents are loaded into couchdb.

**Query API**

[View query API](http://wiki.apache.org/couchdb/HTTP_view_API) is
quite powerful but solving all problems with map-reduce is not
trivial. Recently we had to implement a functionality to find if a
date range overlaps with something else. Here is the gist that does
something like that.

<script src="https://gist.github.com/sreeix/1047810.js">
</script>

As you can see we had to emit all the days for the network and query
the view with a startkey and endkey. This is way too complicated than
a simple SQL query to acheive the same result. I am lucky that my
granularity is days, if you want to find the range over a hourly
basis, then it is much harder. The views will get much slower and
(likely) take larger space.

The [view collation](http://wiki.apache.org/couchdb/View_collation) is
quite useful and powerful, but is it very restrictive. Array or String
keys are used more often than Hash Keys(pretty much useless) for view
collation to retrieve a result set. Even Array keys have
limitations. for example if your view emits

    ['abcnews', 'christiane'], ['cnn', 'christiane'], ['cnn', 'fionnuala']

then

    startkey: ['cnn'], endkey : ['cnn', {}]
would match

    ['cnn', 'christiane'], ['cnn', 'fionnuala']

But you will have to write a new view if you want to search by the
newscaster. i.e. you can't do

    startkey: [{}, 'christiane'], endkey : [{}, 'fionnuala']
or

    startkey: [{}, 'christiane'], endkey : [{}, 'christiane']

**Date Support**

Date Support is pretty primitive. I cringe everytime I have to tell my
team that dates in couchdb have to be in specific format. It may more
be an issue with javascript date handling. But CouchDB spidermonkey
supports only one date format. I do not think couch should go towards
the MongoDB Date data-type, but having Date.parse support multiple
formats, or even iso8601 would be really useful.

As you can see in the gist above, we manually parse the date and build
the date object. This is error prone, there are atleast 2 javascript
subtleties there. (Hint: parseInt(date, 10) and javascript month being 0 indexed)

**Others**

There are some other issues that do not climb high on my radar.

- *Paging.* It is slightly complicated in Couch and has caused a [lot of confusion](http://stackoverflow.com/questions/312163/pagination-in-couchdb), but once you [get the idea](http://guide.couchdb.org/draft/recipes.html#pagination), it's pretty simple to implement. We struggled with it initially, but the pattern fell into place quickly

- *Performance.* The current release of Couch(1.1.1) seems to be much [better on performance](http://twitpic.com/5apy2t) than the older versions. But then we would never choose Couchdb for it's performance alone. There are other alternatives out there.
