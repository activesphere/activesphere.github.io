---
layout: post
title: On composition in React
author: ciju
published: false
---

# Overview #

Much of this article derives from what Sebastian Markbåge (and contributors) has written at [React basic](https://github.com/reactjs/react-basic "React basic"). Why write it then? To explore it in terms of React, and to get some more perspective to it.

We have been using means of abstraction and combination[^sicp-eop] to manage complexity in programming. React provides similar tools for interactive UI. In this article we will try and understand how React achieves this. 

Before we jump into the topic, we will look at the problem that its tackling (building complex interactive UI). After which we will go through the basic elements React builds over. Then we will understand how to represent UI in a declarative way (this avoid lots of complexity around mutation). Finally we will look at the means of abstraction and combination that React provides. But again, we will first look at React in a static (non-interactive) context. And then in interactive context.

[](Main idea: How to think in terms of React. Composition is the best tool to manage complexity. We start with a declarative way of representing UI. Generating this UI in a single function is complex. We need ways to decompose this. We already know function abstraction and composition. Components abstract defining a group of elements together. Components in their simplest form, are just functions. They take properties/attributes and children as parameters, and returns React elements. Components allows for decomposition of React elements. Composition with imperatively managed state is much more difficult. Helps with defining declarative UI while allowing for procedural subparts, where needed. And)

Components, hierarchical, data flow in one direction

# The UI Problem #

Where React came from, is quite important in understanding what its trying to do. From what I understand, React was built to help with managing interactive HTML (and in general interactive declarative UI). Its not trying to tackle front-end application architecture. Its not trying to solve data modeling or management or caching. Its trying to solve, how to represent UI and its state changes. 

## Declarative UI ##

Many UI's are declarative and hierarchical (Ex, HTML, XUL). On web, imperative way of implementing web UI is to interact with DOM api's, and update the HTML. But its not convenient or expressive. Why declarative? Because it removes the burden of making the actual updates, from developer to software. Software can optimize better on how to update UI. And developer now gets a simpler model to deal with UI. Interactive UI now becomes a sequence of declarative UI's. Because it allows software to manage better, how things are rendered. Ex, updates could be merged. And only the required updates sent to the browser. React completely takes over the part of updating UI. With `React.render` we point out the element where the UI should be rendered and the way to generate the UI, and React takes over rendering the UI and future updates to it.

[](Think about what other frameworks were trying to do.)

Now, how can we transform that data to UI, and manage state changes.

Lets first consider the case where we want to render a static non-interactive UI. In other words, we will ignore `setState`, `this.state` and life cycle methods. We will come back to `setState` later. WHAT ABOUT LIFE CYCLE METHODS.

## Declarative UI ##

[](We will start by looking at declarative UI. These are defined in terms of *React elements*. An interactive application could be considered as a sequence of declarative UI. React generates the declarative UI, and manages updates to it. Why does React have to manage and hide DOM updates? Your job is to define the UI in React api. The React api provides ways to define UI components, and allow for their composition. React provides means of *abstraction* and *composition* over these *React elements*. React defines *Components* and their *composition*. This is the biggest contribution by React. How it allows for defining and composing UI components, while allowing for UI state.)

There are many ways to do it. We will only consider declarative way of defining UI. Some exploration of defining UI's is discussed at: mit course.

HTML is a declarative UI DSL. We can define hierarchy of UI elements, to define complicated UI's. A simple example is:

{% highlight html %}
<div>
  <span>
    hello
  </span>
</div>
{% endhighlight %}

### *React elements*: No need for DSL ###

Instead of dealing with another DSL, React represents the declarative UI in (mostly) JSON (which plays well with JavaScript). Example, in React, the above HTML code could be represented as:

{% highlight javascript %}
const UI = {
  type: 'div',
  props: {
    children: {
      type: 'div',
      props: { children: 'hello' }
    }
  }
}
{% endhighlight %}

These are called *React elements*. Note that this is declarative. You are defining how the UI should look. React takes care of managing DOM representation of it. We will consider it as virtual-dom magic.

### JSX - syntactic sugar

It seems a lot more verbose to define the declarative UI in JSON. Fortunately, there is JSX. It transpiles HTML like syntax to something similar to the JSON structure. In other words, to get the above JSON, we would write.

{% highlight html %}
<div>
  <span>
    hello
  </span>
</div>
{% endhighlight %}

### *React Components*: Ways of abstraction ###

But its more than that. Once we can define our own components. We can use them also, with similar syntax. Ex, lets say you have define a component called `SiteNav`. Now you can use it to define your declarative UI. Browser won't understand `SiteNav`, so React would have to replace it with the primitives browser can understand. We will discuss it more later.

{% highlight html %}
<div>
  <SiteNav />
  <span>
    hello
  </span>
</div>
{% endhighlight %}

### Summary ###
You should now have an idea about how the application state could be represented in a declarative way, with JSON. React components generate this declarative UI JSON representation. And further, manage rendering and updating dom (or other UI implementations) based on it. Think of the front-end app as taking a application state and 

You can learn more about this at: [React components, elements and instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

# A functional approach #

Front-end app state and app data. Different things (conceptually). I am not sure if there is right or wrong, but guideline is to use front-end app state for transient front-end state. Ex, hover, scroll position etc.

React gives an api to generate declarative UI. And manages how that UI is updated onto dom or other rendering targets. 

A first (but wrong) approximation of React is that on each state, it renders the whole app again (with the new state). Wrong because of life cycle methods.

### React as a function ###

### UI state to declarative UI ###

If you are building a static non-interactive UI (a static web-page), you could implement it as transforming `data` to `declarative UI`. `data -> DUI`.

Think of it as a function from data to declarative UI (which is just another representation of data). Now, instead of writing it as a single big function, we could use the tools we use to manage complexity. Function abstraction and composition. But we have to be careful with how we define these basic components. Ex, for composition to be effective, all the components should have similar expectations about their parameter and return type. 

We could imagine a framework which takes state of UI, and generates the declarative UI for it. Now, we could imagine the whole UI being a function of the state. But implementing it as a single function is much tougher. React solves this with function composition. Our end result has to be `const UIFn = (data) => declarativeHTML`. Just like we split functions to manage complexity, we can split UIFn. 

This blog explores some of the reasons behind it. 

HTML is a declarative way to define UI.

Abstraction and composition are important part of managing complexity in software. React is probably the outlier in the ecosystem of UI libraries, in terms of the importance it gives to composition. We will also take this opportunity to understand the two introductory paragraphs on React homepage. Example,

> ## Declarative
> React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

> ## Component-Based
> Build encapsulated components that manage their own state, then compose them to make complex UIs.


Front-end applications have grown in complexity. Much of software is about how to manage complexity. Approaches where state is represented as mutable disparate stores, add caching & invalidation & syncing concerns to application development. The idea behind functional paradigm is to do away with mutation, and have a single source of store/truth. It relieves the developer from the concerns of syncing and invalidating derived state, etc. 

Declarative UI is an extension of this. UI is defined in terms of the state of store. As a mental model, we have to only worry about what UI should be for each state.

## Declarative UI

[](short intro about declarative uis. Ex, what are different options? Why does it make sense? What are imperative options?)

[](React’s true strengths: composition, unidirectional data flow, freedom from DSLs, explicit mutation and static mental model. https://medium.com/@dan_abramov/youre-missing-the-point-of-react-a20e34a51e1a)

Most declarative UI seems to follow a tree based representation. Ex, a tree of UI elements.

Most UI libraries and frameworks seem to concentrate a lot on Abstraction, but not as much on composition. 

React allows composition while allowing declarative UI, state (and performance).

Think of it as building an application with only function components. No state changes. This is the first abstraction we will discuss. This is easier to understand.

## React generates 
# Summary

React generates a declarative UI. The components and their composition define how the UI tree is generated.

In summary: We will consider the React perspective (point of view). And how it fits nicely throughout its whole api design.

https://gomatcha.io/guide/concepts/

Many user interfaces, are defined in terms of declarative tree of UI elements. A common example is HTML[^andcss]. Ex, 

[](show examples.)

React takes it a step further. It allows for defining UI elements (Components), with state, which can be composed to generate the tree of UI elements. And for most parts, it also looks like a tree of UI elements

Lets build this intuition, one by one. 

First, React Component generates returns a tree of UI Components. Instead of looking at React, lets think of it in terms of functions. Ex, a component, in its simplest form is a function which returns a tree of UI Components.

# A mini-react #

1. declarative UI
2. mini-react = data -> dui
3. Composition and abstraction
4. Adding state
5. Memoization (why it matters)

# Implementation #
There are a few efforts into writing the React api from scratch (for educational purposes). 

# De

In summary: React starts with premise of UI being a mapping from data to data. Ex, `app data => UI representation => UI` . In order to reach there first consider `data (declaring UI) => UI`. Ex, `app data => declarative UI data => UI (platform specific)`. The declarative data is built with components. Components which can be composed with each other. This would have been enough, if UI didn't have state or interactions. Thankfully React has ways for Components themselves to have state (and again the beauty is that its designed to not interfere with composition). Ex, `(app data, state) => declarative UI data => UI`. The composition of components becomes the function, which takes app data and builds the declarative UI. And maintains it across state changes. In other words, you can define what the declarative UI should be for the data and state, and React will manage the UI for you.

This is explained at [React basic](https://github.com/reactjs/react-basic "React basic"). 

Lets look at it from the perspective of The Elements of programming. A perspective pointed out in SICP. React is not a language. But the abstraction it builds is quite powerful and general. I think, its biggest contribution, is to show how to have declarative composition, while allowing for state changes.

> Every powerful language has three mechanisms for accomplishing this:

> * primitive expressions, which represent the simplest entities the language is concerned with,
> * means of combination, by which compound elements are built from simpler ones, and
> * means of abstraction, by which compound elements can be named and manipulated as units.

React is a composable declarative UI library. 

# Declarative UI
The UI is declared in as a tree (similar to HTML). The elements of there are called `Element` in React. Ex, if you want to say that your UI is a `div` encapsulating a `div` with text `hello`, it could be written as


And this will get you:
{% highlight html %}
<div>
  <div>
    hello
  </div>
</div>
{% endhighlight %}

We will come to input and user interaction later. But it seems that most UI could be represented this way.

How does React actually represent it? Why is there a conversion to a createClass thing. Why not directly to the json structure.


# Primitives
# Ways of combination
  How components are first class details.
# Ways of abstraction
  Components abstracting away details.

# Component vs templates

Why GraphQL fits this well.


# Comparisons with MVC #

Warning: Don't try to fit this into MVC mental model. Its a tool, which you could use in a MVC framework. Or a 
Don't try to fit it into MVC. Its all about managing UI. 

Think of MVC as slicing the web app problem vertically. Ex, 

Where lies the complexity. For front-end applications, the complexity lies in the components and interactions. For a backend application, 

Front-end is push based. Backend is pull based. Ex, models update single store. And when pulled show the updated info (unless you have messed with caching). Front-end apps are push based (ex, dom is rendered). Updates to store on front-end needs to be syncd to other models. And based on model updates, UI needs to be updated, etc. This easily becomes complicated.

Splitting the concerns vertically vs horizontally. MVC vertical. React only UI (horizontal). 

With MVC one would have to keep the models in sync, and update everything based 

React only tackles the UI part (view). In other words, it could be used in a MVC like framework. 

Lightweight components and composition. Allows for a very different approach to managing complexity, than MVC.


# References
[Gilad Bracha - Composing Software in an Age of Dissonance](https://www.youtube.com/watch?v=TrNlNjwzzmc)
[Pete Hunt: React - Rethinking Best Practices (updated) - JSConf.Asia 2013](https://www.youtube.com/watch?v=DgVS-zXgMTk)
[React components, elements and instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
[UI Software Architecture](http://web.mit.edu/6.813/www/sp17/classes/05-ui-sw-arch/)

[^andcss]: And to have more complex placements, could have another api to layout the elements. In HTML's case, its CSS.
[^sicp-eop]: [SICP: The Elements of Programming](https://mitpress.mit.edu/sicp/full-text/sicp/book/node5.html)

https://aster-community.teradata.com/community/learn-aster/blog/2016/08/06/declarative-vs-procedural-approach-to-data-science
https://stackoverflow.com/questions/602444/functional-declarative-and-imperative-programming
https://tylermcginnis.com/imperative-vs-declarative-programming/
