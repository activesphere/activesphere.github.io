---
layout: post
title: Goodbye Rails, Hello Node.js
published: true
author: Sreekanth
categories:
- architecture
- evented
- javascript
- node.js
- rails
- ruby
---

A few months ago, I decided to play with
[node.js](http://nodejs.org/). The new server side JavaScript hotness
and now I am hooked onto it. I use Ruby on Rails for most of my
work. Though I am not a big fan of Rails, it is better than most
things around and it's in Ruby which I really like.


Off-late most projects that I have been working on, have much less
ruby and a lot more of JavaScript. My typical application consists of
thin RESTful API transporting data as JSON, which is consumed by
JavaScript in the browser. Can we not use JavaScript for the whole
application instead? And get significant other benefits as well?

This is where Node.js fits in. Sitting on top of the highly performant
Google V8 JavaScript engine, it gives you a bunch of libraries to
write your networking code. In other words, it is JavaScript on the
server side. FTW

As a side note, I used to be extremely scared of the JavaScript
funkiness, till I apprenticed with some JavaScript masters. Over a
period of time working on more and more JavaScript, I have gotten
pretty proficient. I still don't have the same control with JavaScript
as I have on Ruby and I still forget to add the semicolons to the
statements, but it's not that often now.

Asynchronous event driven API that leads to high scaling and lower
memory footprint, we all know that (The now famous [C10K
problem](http://www.kegel.com/c10k.html)). I have used EventMachine in
Ruby and it always felt like working against the grain in ruby. Blocks
typically are thrown for instant execution and rarely as a
callback. The lack of Fibers in Ruby 1.8.7 does not help. Turning
non-evented ruby code into evented ones is mind-bending exercise till
you get it.

On Node.js it's the most natural way of programming, it doesn't even
feel like a shift in style. JavaScript programming is all about
callbacks invoked later in time. There is no such thing as EM.defer
and EM.run, and checking if you are in a reactor loop.

There is some serious innovation happening around Node.js. Some are
being built over experiences of other Languages. There is no such
thing as Rails for node.js (which I consider a smashing thing). Most
people use [Express](https://github.com/visionmedia/express) which is
similar to Sinatra. [Coffee
script](http://jashkenas.github.com/coffee-script/) became popular
because of and in the Node.js community. Now the Rails community is
[trying to make coffee script the default
](https://github.com/rails/rails/compare/9333ca7...23aa7da). RVM
became popular only in recent times in the Ruby Community, We already
have NVM doing the same thing for node versions. I can't forget to
mention the fantastic [Socket.io](http://socket.io/) for realtime push
applications and it is truly trivial to use.

The mushrooming of cloud hosting for node.js is also a proof that a
lot of vendors think it's interesting. Just off the top of my head,
there is Joyent's [no.de](https://no.de/),
[Cloudfoundry](http://www.cloudfoundry.com/),
[Duostack](https://www.duostack.com/) and
[Nodester](http://nodester.com/) all in some sort of beta
stage. Although from my brief experiments, I prefer the CloudFoundry
to no.de and Duostack.

And Rails definitely does not have a rap theme song as cool as
this. [http://soundcloud.com/marak/marak-the-node-js-rap](http://soundcloud.com/marak/marak-the-node-js-rap). (Listen
with headphones, please)
