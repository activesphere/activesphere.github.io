--- 
layout: post
title: NodeKnockout and Activenode.no.de
published: true
author: Sreekanth
categories: 
- activenode
- coffeescript
- javascript
- monitoring
- node.js
- nodeknockout
- redis
---
Last weekend we participated in the community driven 48 hour programming contest called [Node Knockout.](http://nodeknockout.com/) The idea is to go from an idea to production in exactly 48 hours using the wonderful [Node.js](http://nodejs.org/). Noders from all over the world compete for the prizes that are awarded based on Innovation, Design, Utility and Completeness

We'd signed up long time ago, but we had no idea what we would be building till the morning 5.30AM( 0:00 GMT). Initially I was thinking of building&nbsp; slick visualization over the [Bitcoin](http://www.bitcoin.org) transactions, but because of the limited scope and technical complexity, iI was wary about it. Eventually we decided to build a node.js equivalent the Rails' awesome [New Relic's RPM](http://newrelic.com/). It also looked like something that could be build progressively, and be done quickly.

Another choice I had to make in the morning was the choice of deployment, We had to choose better the 3 official alternatives


- [Joyent's No.de](http://no.de) platform : It's easy to deploy and we
  get ssh access to the machines, but it uses Solaris and it's weird
  package manager, that we had very little idea about.

- [Linode](http://www.linode.com): Very flexible, and we get the
  choice of OS. But much harder to get the deploys right. We had to
  script our own, there was good documentation though

- [Heroku](http://www.heroku.com): An in between option, good
  deployment support but lack of ssh access and apps was a turn off.


We chose Joyent's No.de which remained our final deployment platform. We briefly switched to Linode, because for the first day of our usage No.de had broken web socket support, so the real time updates to the map was not possible. This issue was fixed the next day and we switched back to no.de for our deployment. It sucked a bit of time away but it was not really that much.

It is currently hosted [here](http://activenode.no.de/).

We used [Redis](http://redis.io/) for our storage, and later it turned out that it was a good choice, simpler storage format was a win. We used the [Redis's monitor](http://redis.io/commands/monitor") feature to build the [live map](http://activenode.no.de/hosts/activenode.no.de/live_map). We'd pick the new request's Remote host and translate it to the city of origin which was plotted on the map. This gave us an awesome integration with [socket.io](http://socket.io/). I am still at a loss of how we would have implemented it in any other database( couchdb's changes would also work)

We also used the awesome [CoffeeScript](http://coffeescript.org/) to write the code, both of us were not CoffeeScript experts, but it was never a cause of any weird issue.

We published a npm module
[activenode-monitor](http://search.npmjs.org/#/activenode-monitor") (npm modules are equivalent of ruby gems) for usage in the express applications. But since it needed to talk to a central Redis on the no.de machine, which was not accessible from outside the machine(no.de has weird ssh setup) we could not get it to work. It took us a lot of time to realize that we could just use the free Redis plan of [redistogo](http://www.redistogo.com). And it just worked wonderfully well once we integrated it.

We store a lot of interesting client/server information into redis(though we did not get the time to implement views for all of it) and we are filling up the 512K of memory available on the free plan in about a day. So I need to flush out all the data almost every day.

It's an amazing experience to compress so much learning into 48 hrs,  sometimes we were dazed and confused and sometimes in a wonderful flow. Having a usable app at the end of it is definitely a bonus.&nbsp; Right now the judges are rating the final [180 entries](http://nodeknockout.com/entries) out of the 302 that started. Some of the feedback we've got is pretty encouraging. We seem to be scoring high on utility and design and low on innovation and completeness. So any chance of our winning or being in the high ranks is unlikely.

I can excuse myself for the completeness, because of a conincidence of [devops conference](http://devopsdays.org/) occuring on the same weekend and i had signed up to talk about Devops on Cloud. Finishing the slides, preparing and delivering the session sucked a lot of time out of my Sunday.

All in all it was good fun and a wonderful learning experience. We are looking forward to NodeKnockout 2012.

If you have reached the end of this. Please show us some love by voting for the app [here](http://nodeknockout.com/teams/activenode).

