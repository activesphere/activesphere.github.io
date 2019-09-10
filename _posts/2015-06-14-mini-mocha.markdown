---
title: "Mocha TDD like DSL in less than 100 lines"
tags:
- programming
status: publish
type: post
author: ciju
published: true
---

**TL;DR**
A minimal synchronous mocha like DSL, in less than 100 lines of
JavaScript. Code at [github.com/ciju/mini-mocha](http://github.com/ciju/mini-mocha)


Our of curiosity, I tried to implement a Mocha like DSL. Seems like,
the core of the DSL, could be written quite succinctly. First we will
describe the core DSL.

## Minimal Mocha DSL details

The 4 functions below, seem to be the relevant ones.

{% highlight javascript %}
describe(desc, fn)
setup(fn)
teardown(fn)
it(desc, fn)
{% endhighlight %}

`setup`, `teardown` and `it` are used inside a `describe` block.

The important part is, `describe` could be nested within `describe`,
to arbitrary depth. ex:

{% highlight javascript %}
describe('top level describe', function (){
    // ...
    describe('nested describe', function () {
        // ...
        describe('nested nested describe', function () {
            // ...
        })
        // ...
    });
    // ...
});
{% endhighlight %}

So each describe could have `setup`, `teardown`, `it` and well
`describe` calls.

At any level, all functions registered in `setup` should be run
first. Then all the tests registered with `it`, and then all the
nested `describe` have to be executed. After all that, function
registered with `teardown` should be executed. Ex:

- Call setup functions
- Execute all the test in the level
- Execute all nested levels
- Call teardown functions

## So, how do we solve it.

Lets first think just one level (ex: ignore nested describes). We
would have to collect all the DSL commands at that level, and then
execute them in a specific order. Note that we can't just execute the
commands in the order we come across. Example, a `setup` might come
after tests (`it`). But all the `setup` in a level have to be run
before the tests. The way I achieve this is to define all the DSL
commands as functions which save the command, and its arguments, to be
executed later. ex: `setup(fn)` would save a pair `["setup", fn]`. ex:

{% highlight javascript %}
// 'key' being the dsl command, and 'val' arguments
function spush(key, val){
    stack[stack.length-1][key].push(val);
}
{% endhighlight %}

We will come to the `stack` part later. Now, once all the commands in
a describe level are collected, they are to be executed one by one.
Execution of `setup` and `teardown` commands is simple. Just execute
the function registered with them, in the context (there is a single
context, on which all setup and teardown work). Test (functions
registered with `it`) are executed by running the registered function,
and showing success or failure based on output. For now, it just
checks for the exception thrown by the function. Ex:

{% highlight javascript %}
function reportTests(fn, desc) {
    desc = test_title(stack, desc);
    try {
        fn.call(ctx);
        success(desc);
    } catch(e) {
        failure(desc, e.message);
    }
}
{% endhighlight %}


Describe is the special case. Executing it, essentially means doing
the above, at the nested level (ex: the function registered with the
`describe`). Note that `teardown` should run at the end. So, some
information about the current level has to be saved, till all the
nested levels are done. This is the reason to have stack, to keep the
commands. `describe` is kind of the main function of the DSL.

{% highlight javascript %}
function exec_describe(title, tfn) {
    stack.push(new_top(title));
    // collect 'describe', 'setup', 'teardown' and 'it' for the current level
    tfn.call(ctx);
    exec_top();  // execute them
    stack.pop();
}
{% endhighlight %}


Well, thats mostly it. There are some small details. Like directly
executing the `describe` the first time we come across it (the process
has to start somewhere). Or printing the titles etc.

For more details look at the
[code](https://github.com/ciju/mini-mocha/blob/master/describe.js).
Its nice to find out that an expressive DSL could be implemented (to
at least experiment) in less than 100 lines of code.

*PS: ActiveSphere is hiring. If you would like to join, try your hands at making this code handle asynchronous tests. You can find the problem description [here](https://gist.github.com/ciju/c321a972ab22656e5988). Visit our [careers](/careers.html) page. Send us a mail at [career@activesphere.com](mailto:career@activesphere.com).*
