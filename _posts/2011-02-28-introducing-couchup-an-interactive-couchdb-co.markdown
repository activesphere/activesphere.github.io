---
title: Introducing Couchup. An interactive Couchdb Console
published: true
hidden: true
author: Sreekanth
categories:
- console
- couchdb
- couchup
- nosql
- tech
---

Recently a friend asked me how to fetch multiple documents from couch
using a single request. Couch 0.90 and above provided the ability to
post to couch the array of keys to return the matching documents. But
he was having trouble getting curl to work correctly. I had to dig
through the code to give him the actual curl request.


One thing that I could never figure about the CouchDB tools ecosystem,
was the total lack of a simple console to interact with
CouchDb. MongoDb has a [mongo command line
client](http://www.mongodb.org/display/DOCS/mongo+-+The+Interactive+Shell). Even
Cassandra has a simple
[cassandra-cli](http://wiki.apache.org/cassandra/CassandraCli).

I know Futon is nice, but as a developer i need more power. And even
though HTTP is ubiquitous, i need simple ways of sending requests to
Couchdb, without dealing with setting the headers and json encoding
the parameters.

So I wrote a simple, irb based Couchdb Console, we call it Couchup. It
gives a simple way of accessing couchdb via command line. The source
is hosted on [here ](https://github.com/sreeix/couchup).

It's quite simple and based on the awesome
[couchrest](http://github.com/couchrest/couchrest) gem

You can install it on your machine by running

<script src="https://gist.github.com/847248.js">
</script>

It definitely is not a replacement to
[Futon](http://wiki.apache.org/couchdb/Getting_started_with_Futon),
but is a simple way of interacting with couchdb. And it does some
nifty things that Futon cannot do. Like, using the endkey/startkey to
query views, IMHO one of the most powerful couchDB features.

Couchup can do a lot more, and i am using some of my 20% time to make
those changes. The documenation will be kept up to date on the [github
pages](https://github.com/sreeix/couchup/blob/master/Readme.markdown).

One design choice I had to make about couchup was the choice of basing
it on irb, which means that it has to follow ruby syntax. This can be
extremly powerful for people who are familier with ruby&nbsp; and
easily write scripts based on it. The flip side though is that it has
to follow the ruby syntax which leads to some verbosity in the
commands.

eg.

> create :database, :foo

is the correct way of creating databases, instead of conventional(from
mysql client)

> create database foo

There is a bunch of stuff that needs to be done on couchup and it is
rough not just on the edges but also in the core. But i hope to
finetune it to something that could be a useful tool in you couchdb
toolbox.

And yeah, any feedback on what could be done better would be
great. Feel free to send me an email
[sreeix@gmail.com](mailto:sreeix@gmail.com).
