---
title: "Logging with Colors in JavaScript Console (Chrome/FF)"
categories: [logging, javascript, tech]
description: Help with managing the information overload in JavaScript Console logs.
status: publish
author: ciju
type: post
published: true
comments: true

---

> [colorlog.js](https://gist.github.com/ciju/5926584) Helps with
> managing the information overload in JavaScript Console logs.


Trouble with finding that one log, in a overload of logs in JavaScript
Console[^1]? How about `log.green("args")`, or `log.yellow("args")` or
may be even `log.red("args")`. Well, that is how I started on
[colorlog.js](https://gist.github.com/ciju/5926584). But now it has
become a little more than that.

JavaScript code by me is usually wrapped in an
[IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/).
This helps with managing logging also. For example, note that we
didn't use `console.log`, but rather just `log`. Here is how it
happens.
{% highlight js %}
    App = {} // The global application object

    (function (app, log) {
        function afunc() {
            log.green("args"); // a green background log
            log("args"); // a normal log
            log.yellow("args", {a:'object'}); // log objects too
        }
        App.afunc = afunc;
    }(App, App.log.withPrefix("moduleName:")));

{% endhighlight %}
And with `App.afunc()`, that gives (in Chrome).

<img src="/public/images/blog/consolelog.png"/>

Well, that doesn't explain how `App.log` came about, but wait. Note
how we can conveniently add a prefix for all the logs called from this
module. Well, its not just that. Replace `App.log.withPrefix` with
`App.log.mute` and logs from the module won't be shown. Oh, and you
can use `App.log` also, if you don't need the prefix.

Well, that is almost it. Except for a small function
`log.instrument_fns`. Call it on an hash of functions, and every time
one of those functions is called, a log will be shown in console, in
_red_. I know, silly. Please only use it for small debug sessions. It
should _never_ go out in the wild.

Change things as you like, after copying the code from below. And yes,
if you look at the code below, you will know how `App.log` came about.

<script src="https://gist.github.com/ciju/5926584.js"></script>

One of the big downsides with this library, is the
[line number mess](http://stackoverflow.com/questions/1340872/how-to-get-javascript-caller-function-line-number-how-to-get-javascript-caller).

Note: cross-posting from
[ciju's blog](http://ciju.in/blog/2013/09/logging-with-colors-in-javascript-console.html)

[^1]: In the days before, I used to do `console.log("********", "actual arguments");` or something like that.
