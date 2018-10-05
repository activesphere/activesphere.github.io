---
title:  "Backpropagation: A needlessly explicit intuition for the derivation"
tags:
- backpropogation
- neural
- networks
- machine
- learning
type: post
author: rahul
published: false
comments: false
math: true
---

In this post, we try to derive backpropagation and visualize the pattern it forms by tracing in over the network. The derivation is 'needlessly' explicit & meant for people who *like me* are new to neural networks and rusty with calculus. That being said, I've assumed that readers are have some degree of familiarity with both, especially the [chain rule](https://en.wikipedia.org/wiki/Chain_rule). Also, the derivation has been simplified a bit by not using sigmoid activations.


Let's consider this simple 2 neuron network.

![](/public/images/blog/bp1.svg)

Here,

- \\( x_1 \\) is the input neuron
- \\( w_1 \\) is the weight applied to it
- \\( y_1 \\) is the output neuron
- \\( t_1 \\) is the training output
- \\( E \\) is the error/cost

where

$$ y_1 = x_1 w_1 $$

$$ E = \frac{1}{2} (t_1 - y_1)^2 $$

The gradient can be expressed as follows

$$ \begin{align}
	\Delta w_1 = \frac{\delta E}{\delta w_1} & = \frac{\delta}{\delta w_1} \frac{1}{2}(t_1 - y_1)^2  \\
	& = (t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_1}) \\
	& = (y_1 - t_1)x_1 \label{a}\tag{1}
\end{align}$$


Let's add a hidden layer to the network

![](/public/images/blog/bp2.svg)

$$ \begin{align}
	\Delta w_1 & = \frac{\delta E}{\delta w_1} \\
	& = \frac{\delta}{\delta w_1} \frac{1}{2}[(t_1 - y_1)^2] \\
	& = (t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_1}) \label{b}\tag{2}
\end{align}$$

We know that

$$ y_1 = h_1 w_2 $$

$$ h_1 = x_1 w_1 $$

Using chain rule,

$$ \begin{align}
	\frac{\delta y_1}{\delta w_1} & = \frac{\delta y_1}{\delta h_1} \frac{\delta h_1}{\delta w_1} \\
	& = w_2 x_1
\end{align}$$

Substituting back $$ \ref{b} $$, we get

$$ \begin{align}
	\Delta w_1 & = (y_1 - t_1) w_2 x_1 \label{c}\tag{3}
\end{align}$$

Let's go back to our 2 layer network where we derived $$ \ref{a} $$ and try to generalize it over any number of output neurons. Over 2 output neurons, our network looks like this.

![](/public/images/blog/bp3.svg)

The error $$ E $$ is the total error across $$ y_1 $$ & $$ y_2 $$.

$$ \begin{align}
	\Delta w_1 = \frac{\delta E}{\delta w_1} & = \frac{\delta}{\delta w_1} \frac{1}{2}[(t_1 - y_1)^2 + (t_2 - y_2)^2]  \\
	& = (t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_1}) + (t_2 - y_2) (0) \\
	& = (y_1 - t_1)x_1
\end{align}$$

Since we're differenting w.r.t \\(w_1\\), t2 and y2, not contributing to it, are constants & will be 0

Similarly,

$$ \Delta w_2 = (y_2 - t_2)x_1 $$

More generally, if the input layer has $$i$$ neurons & the output layer has $$k$$ neurons

$$ \Delta w_k = (y_k - t_k)x_i \label{d}\tag{4}  $$

Let $$ \delta_k = y_k - t_k $$ which denotes the output error

$$ \Delta w_k = \delta_k x_i  \label{e}\tag{5} $$

Let's take our learnings from above and apply it to a multi-layered, multi-tiered network

![](/public/images/blog/bp4.svg)

*Note: The superscript $$ L $$ in $$ w^L $$ does not denote an exponential, but is merely a way to differentiate between weights in different layers.*

Let's try and find $$ \Delta w_{11}^1 $$

$$ \begin{align}
	\Delta w_{11}^1 = \frac{\delta E}{\delta w_{11}^1} & = \frac{\delta}{\delta w_{11}^1} \frac{1}{2}[(t_1 - y_1)^2 + (t_2 - y_2)^2]  \\
	& = [(t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_{11}^1}) + (t_2 - y_2) (0 - \frac{\delta y_2}{\delta w_{11}^1})] \label{f}\tag{6}\\
\end{align}$$

We know that

$$ y_1 = h_1 w_{11}^2 + h_2 w_{21}^2 $$

$$ y_2 = h_1 w_{31}^2 + h_2 w_{41}^2 $$

$$ h_1 = x_1 w_{11}^1 + x_2 w_{21}^1 $$

$$ h_2 = x_1 w_{31}^1 + x_2 w_{41}^1 $$

Using chain rule,

$$ \begin{align}
	\frac{\delta y_1}{\delta w_{11}^1} & = \frac{\delta y_1}{\delta h_1} \frac{\delta h_1}{\delta w_{11}^1} \label{g} \tag{7} \\
\end{align}$$

The red items in the figure are not directly related to $$ w_{11}^1 $$ and are set to 0.
The network now can be reduced to.

![](/public/images/blog/bp5.svg)

$$ \frac{\delta y_1}{\delta w_{11}^1} = w_{11}^2 x_1 $$

$$ \frac{\delta y_2}{\delta w_{11}^1} = w_{21}^2 x_1 $$

Substituting in \\( \ref{g} \\), we get

$$ \begin{align}
	\Delta w_{11}^1 & = [(t_1 - y_1) (0 - w_{11}^2 x_1) + (t_2 - y_2) (0 - w_{21}^2 x_1)] \\
	& = (y_1 - t_1)w_{11}^2x_1 + (y_2 - t_2)w_{21}^2 x_1 \\
	& = x_1[(y_1 - t_1)w_{11}^2 + (y_2 - t_2)w_{21}^2] \\
	& = x_1\sum_k(y_k - t_k) w_{k1}^2
\end{align}$$

A pattern seems to emerging. Let's add another hidden layer to see if the pattern solidifies.


![](/public/images/blog/bp6.svg)

Let's start with eq. $$ \ref{f} $$ as a base

$$ y_1 = h_1^2 w_{11}^3 + h_2^2 w_{21}^3 $$

$$ y_2 = h_1^2 w_{31}^3 + h_2^2 w_{41}^3 $$

$$ h_1^2 = h_1^1 w_{11}^2 + h_2^1 w_{21}^2 $$

$$ h_2^2 = h_1^1 w_{31}^2 + h_2^1 w_{41}^2 $$

$$ h_1^1 = x_1 w_{11}^1 + x_2 w_{21}^1 $$

$$ h_2^1 = x_1 w_{31}^1 + x_2 w_{41}^1 $$

$$y_1$$ now has 2 paths to reach $$ w_{11}^1 $$ through $$ h_1^2 $$ and $$ h_2^2 $$

Using the multivariate chain rule $$ \ref{g} $$ would now become

$$ \begin{align}
	\frac{\delta y_1}{\delta w_{11}^1} & = \frac{\delta y_1}{\delta h_1^2} \frac{\delta h_1^2}{\delta h_1^1} \frac{\delta h_1^1}{\delta w_{11}^1} + \frac{\delta y_1}{\delta h_2^2} \frac{\delta h_2^2}{\delta h_1^1} \frac{\delta h_1^1}{\delta w_{11}^1}\\
	& = w_{11}^3 w_{11}^2 x_1 + w_{21}^3 w_{31}^2 x_1 \\
	& = x_1(w_{11}^3 w_{11}^2 + w_{21}^3 w_{31}^2) \\
	\frac{\delta y_2}{\delta w_{11}^1} & = x_1(w_{31}^3 w_{11}^2 + w_{41}^3 w_{31}^2)
\end{align}$$

Substituting in \\( \ref{g} \\), we get

$$ \begin{align}
	\Delta w_{11}^1 & = [(t_1 - y_1) (0 - x_1(w_{11}^3 w_{11}^2 + w_{21}^3 w_{31}^2)) + (t_2 - y_2) (0 - x_1(w_{31}^3 w_{11}^2 + w_{41}^3 w_{31}^2))] \\
	& = x_1[(y_1 - t_1) (w_{11}^3 w_{11}^2 + w_{21}^3 w_{31}^2) + (y_2 - t_2) (w_{31}^3 w_{11}^2 + w_{41}^3 w_{31}^2)] \\
	& = x_1 \sum_k(\delta_k) \sum_{paths}(product of all weights in the path)
\end{align}$$
