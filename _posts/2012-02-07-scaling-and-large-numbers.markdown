--- 
layout: post
title: Scaling and Large numbers
author: sreeix
published: true
---

Let's take a pop Quiz.

An alter table on a MySQL database, takes 10 seconds to execute on a
table of 30,000 rows.

How much time will it take on a table that has 80 million rows?

Try and take an educated guess of what the real time would have been?

Scroll down for the answer.

So here goes a real story.

We needed to add a column to this table in one of my projects, and I
intuitively assumed, it probably won't take more than couple of hours.

For somebody who's been working with large amounts of data, it was a
stupid call to take. Even a back of the envelop calculations assuming
linear scaling reveals it will take about 8 hours.

One of the biggest thing you learn when dealing with such big numbers
( 100 million is not by any extent a large number these days) is that
intuition is really bad at figuring these things. It is the similar to
the situation described by [George Gamow's](http://www.amazon.com/One-Two-Three-Infinity-Speculations/dp/0486256642)
(Hottentots) Tribe, that has only 4 numbers one, two three and many.

Also to remember that a lot of things especially at large numbers do
not scale linearly. (Of course I can't say these of all systems)


This is one of the reasons why I've seen a lot of apps that work very
well with say 100,000 users fail spectacularly when numbers
increase to even 1 million or 50 million.

This graph shows that [Couchdb](http://couchdb.apache.org/) 
performance seems to get worse especially at the 1 million mark, and
even increase steadily afterwards.

![couchdb 1.1 write performance over 5 million docs on my laptop](/images/scaling-couchdb.jpg)

A project that ignored to do this basic benchmarking failed pretty
badly to get beyond a few million documents in the database.

The only way you can build this intuition is to do it and figure it
out over and over again. There is no replacement for real metrics that
use the size and the shape of your data.These sorts of data is not
amenable for "Oh! I can do it again" agilistic way of solving
problems. Because of the times involved. Most big data problems have
to be thought through upfront, otherwise it causes a lot of time
wastage and downtime.

In Summary, Discard your intuitive thinking when dealing with large
numbers. Create a model with the data similar in shape and size to
base  your estimates on. Otherwise there is a lot of wasted time and
unplanned downtime for your application.

*Answer:*
> It took 1 day and 16 hours for our alter table to complete. Almost 5 times the estimated time
