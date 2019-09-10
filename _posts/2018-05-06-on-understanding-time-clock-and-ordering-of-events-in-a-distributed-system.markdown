---
layout: post
title: On understanding "Time, clock and ordering events in a distributed system"
viz: true
author: ciju
published: true
---

This blog a result of internal discussion we had about the paper. Few of us thought that the paper was about ordering events in distributed systems (and this seems to be a common interpretation). But as Leslie Lamport points out:

> It didn't take me long to realize that an algorithm for totally ordering events could be used to implement any distributed system.  A distributed system can be described as a particular sequential state machine that is implemented with a network of processors. **The ability to totally order the input requests leads immediately to an algorithm to implement an arbitrary state machine by a network of processors, and hence to implement any distributed system.** So, I wrote this paper, which is about how to implement an arbitrary distributed state machine.  As an illustration, I used the simplest example of a distributed system I could think of--a distributed mutual exclusion algorithm.

> -- [27. Time, Clocks and the Ordering of Events in a Distributed System](http://lamport.azurewebsites.net/pubs/pubs.html#time-clocks) (Emphasis mine)

This is a blog about how to get to that understanding.

## The problem ##

The TC (short for Time, Clocks and the Ordering of Events in a Distributed System) paper is a statement about   How can we think about distributed system.

One way to look at distributed system, is to consider it as a collection of **processes** communicating by passing **messages**. If we consider the whole thing as a single system, we need to be able to think of it as a system which given its initial state, and some events, ends up in a certain state. An example is the consensus problem (a set of processes agreeing on some value).

If we want deterministic results from distributed system, we would have to bring determinism into its components. The processes and the messages (more on this later).

But this is difficult. As an example, its impossible to guarantee consensus, in a distributed system where even one system can fail.

To say things in a deterministic way, we need to add determinism to the system. E.g. We the processes need to be deterministic. One way to do that, is to consider them as state machines. Note that even reading the clock is non-deterministic. You can depend on clock, for if you include clock, then you have to have guarantees about the clock. Which are difficult to make.

The t


What is distributed system. What can we say about programs running in a distributed system. A program running on a single process is difficult enough to reason about. How do
