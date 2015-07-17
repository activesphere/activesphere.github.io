---
layout: post
title: "Y combinator in small steps"
tags:
- programming
status: publish
type: post
author: ciju
published: true
comments: true

---

The Y combinator is an interesting construct, allowing recursion
without referring the function being recursed. In other words, call a
function recursively, without naming it. We will go through one
approach of deriving it.


This approach somewhat follows <a
href="http://www.dreamsongs.com/NewFiles/WhyOfY.pdf">WhyOfY</a> by
Richard P Gabriel <sup>[1](#references)</sup>. We will derive it in
JavaScript, in steps. Each step is complete. Click on the 'Edit in
JSFiddle' to explore the steps.

## Premise & setup

Lets pick a simple example, so we can concentrate on exploring
recursion. Given a number, `n`, return the sum of numbers from `1` to
`n`. To start with, below is a recursive solution for the
problem. Individual steps are hosted in JSFiddle, for you to play
around.

<iframe width="100%" height="130" tabs="js" src="//jsfiddle.net/ciju/rLd57d07/12/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## The process

We have to remove the reference to `sum`, inside the function, which
fortunately leads to the Y combinator. One approach to calling a
function, without using its name, is to pass the function as
parameter.

<iframe width="100%" height="130" src="//jsfiddle.net/ciju/rLd57d07/13/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

We have just moved the function name (reference) from inside the
function, to the function call. As a next step, we could pass the
function as a <a href="https://en.wikipedia.org/wiki/Currying">curried
param</a>.

This helps later, in abstracting the passing of function as
parameter, out of the logic for the problem.

<iframe width="100%" height="150" src="//jsfiddle.net/ciju/rLd57d07/25/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The double call inside the inner function, is quite irrelevant to the
problem of calculating sum. The logic of `sum` shouldn't know that
`h(h)` gives the next function call. The recursive function should
just receive a function, to continue the recursion with. We could
abstract that in another function. Ex:

{% highlight javascript %}
// replace
return function (n) {
    return n === 1 ? 1 : n + h(h)(n-1);
};

// with
return (function(f) {
    return function (n) {
        return n === 1 ? 1 : n + f(n-1);
    };
})(function (n) {
    return h(h)(n);
});
{% endhighlight %}

Why not pass `h(h)` as parameter? Why do we have to wrap it in a
function?

Here is the complete version.

<iframe width="100%" height="230" src="//jsfiddle.net/ciju/rLd57d07/20/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


In the current version, the function dealing with the sum logic,
doesn't have any dependency on context, or specific knowledge about
how to get the next function. Lets name it as `sum` (for the time
being). Ex.

{% highlight javascript %}
var sum = function(f) {
    return function (n) {
        return n === 1 ? 1 : n + f(n-1);
    };
};
{% endhighlight %}

This is just so we can see the real changes in code. Here is the
recursion with `sum`.

<iframe width="100%" height="270" src="//jsfiddle.net/ciju/rLd57d07/16/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

To evaluate the recursion, we had to call `s4` with itself, ex
`s4(s4)`. To not use a name, we would have to abstract it in a
function. We can define a function which `s4` as parameter, and call
it with itself as parameter.

{% highlight javascript %}
var s5 = (function (f) {
    return f(f);
})(s4);
console.assert(s5(5) === 15);
{% endhighlight %}

Expanding the definition of `s4` gives.

<iframe width="100%" height="300" src="//jsfiddle.net/ciju/rLd57d07/21/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

We are almost done. Now, we just need to pass the actual function (ex
`sum` in our case) as a parameter. Here is the `Y` combinator.

<iframe width="100%" height="300" src="//jsfiddle.net/ciju/rLd57d07/18/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Or in its inlined form:

<iframe width="100%" height="270" src="//jsfiddle.net/ciju/rLd57d07/22/embedded/js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Explorations

If you would like to think more about this, here are a few thoughts to
explore.

1. We have only explored function with single argument. How could we
make this work with multiple arguments.

2. Could we come up with a combinator, which doesn't take curried
version of sum. Ex a combinator which takes `sum` defined as `function
sum(f, n) { return n + f(n-1); }` as argument.


*PS: ActiveSphere is hiring. If we can interest you, please visit our
 [careers](/careers.html) page.*

<a name="references">1</a>: A somewhat similar approach is followed by James Coglan's <a
href="https://blog.jcoglan.com/2008/01/10/deriving-the-y-combinator/">blog
post.</a> And watch an interesting <a
href="https://www.youtube.com/watch?v=FITJMJjASUs">talk</a> on it, by
Jim Weirich.