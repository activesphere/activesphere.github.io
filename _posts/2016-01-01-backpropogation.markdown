---
layout: post
title:  "Backpropogation: An intuition"
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

In this post, we try to visualize backpropogation while attempting to derive it by repeatedly applying chain rule. The derivation has been simplified a bit by not using sigmoid activation functions.


Let's consider this simple 2 neuron network.

![](/public/images/blog/bp1.svg)

Here, 

- \\( x_1 \\) is the input neuron
- \\( w_1 \\) is the weight applied to it
- \\( y_1 \\) is the output neuron
- \\( t_1 \\) is the training output
- \\( E \\) is the error/cost

Let $$ y_1 = x_1 w_1 $$. Also, $$ E = \frac{1}{2} (t_1 - y_1)^2 $$

The gradient can be expressed as follows

$$ \begin{align}
	\Delta w_1 = \frac{\delta E}{\delta w_1} & = \frac{\delta}{\delta w_1} \frac{1}{2}(t_1 - y_1)^2  \\
	& = (t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_1}) \\
	& = (y_1 - t_1)x_1
\end{align}$$

Let's add another neuron to the output layer

![](/public/images/blog/bp2.svg)

The error $$ E $$ is across $$ y_1 $$ & $$ y_2 $$. 

$$ \begin{align}
	\Delta w_1 = \frac{\delta E}{\delta w_1} & = \frac{\delta}{\delta w_1} \frac{1}{2}[(t_1 - y_1)^2 + (t_2 - y_2)^2]  \\
	& = (t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_1}) + (t_2 - y_2) (0) \\
	& = (y_1 - t_1)x_1
\end{align}$$

Since we're differenting w.r.t \\(w_1\\) t2, y2 are constants & will be 0

Similarly,

$$ \Delta w_2 = (y_2 - t_2)x_1 $$

More generally, if the input layer has $$i$$ neurons & the output layer has $$k$$ neurons

$$ \Delta w_k = (y_k - t_k)x_i \label{a}\tag{1}  $$

Let $$ \delta_k = y_k - t_k $$ which denotes the output error

$$ \Delta w_k = \delta_k x_i  \label{b}\tag{2} $$

Let's consider this 3 layer neural network

![](/public/images/blog/bp3.svg)

*Note: The superscript $$ L $$ in $$ w^L $$ does not denote an exponential, but is merely a way to differentiate between weights in different layers.*

Let's try and find $$ \Delta w_{11}^1 $$

$$ \begin{align}
	\Delta w_{11}^1 = \frac{\delta E}{\delta w_{11}^1} & = \frac{\delta}{\delta w_{11}^1} \frac{1}{2}[(t_1 - y_1)^2 + (t_2 - y_2)^2]  \\
	& = [(t_1 - y_1) (0 - \frac{\delta y_1}{\delta w_{11}^1}) + (t_2 - y_2) (0 - \frac{\delta y_2}{\delta w_{11}^1})] \label{c}\tag{3}\\
\end{align}$$

We know that

$$ y_1 = h_1 w_{11}^2 $$

$$ y_2 = h_1 w_{21}^2 $$

$$ h_1 = x_1 w_{11}^1 $$

Using chain rule,

$$ \begin{align}
	\frac{\delta y_1}{\delta w_{11}^1} & = \frac{\delta y_1}{\delta h_1} \frac{\delta h_1}{\delta w_{11}^1} \label{d} \tag{4} \\
	& = w_{11}^2 x_1 \\
	\frac{\delta y_2}{\delta w_{11}^1} & = w_{21}^2 x_1
\end{align}$$

Substituting in \\( \ref{c} \\), we get

$$ \begin{align}
	\Delta w_{11}^1 & = [(t_1 - y_1) (0 - w_{11}^2 x_1) + (t_2 - y_2) (0 - w_{21}^2 x_1)] \\
	& = (y_1 - t_1)w_{11}^2x_1 + (y_2 - t_2)w_{21}^2 x_1 \\
	& = x_1[(y_1 - t_1)w_{11}^2 + (y_2 - t_2)w_{21}^2] \\
	& = x_1\sum_k(y_k - t_k) w_{k1}^2 \\
\end{align}$$

A pattern seems to emerging. At the risk of being a bit pedantic, let's add another layer to see how backpropogation looks.

![](/public/images/blog/bp4.svg)

The chain at $$ \ref{d} $$ extends and now becomes

$$ \begin{align}
	\frac{\delta y_1}{\delta w_{11}^1} & = \frac{\delta y_1}{\delta h_1^2} \frac{\delta h_1^2}{\delta h_1^1} \frac{\delta h_1^1}{\delta w_{11}^1} \\
	& = w_{11}^3 w_{11}^2 x_1 \\
	\Delta w_{11}^1 & = x_1[(y_1 - t_1) w_{11}^3 w_{11}^2 + (y_2 - t_2) w_{21}^2 w_{21}^3] \\
	& = x_1\sum_k(y_k - t_k) w_{k1}^3 w_{k1}^2 \\
\end{align}$$

Generalizing over $$h$$ hidden layers (after $$l$$), we get

$$ \begin{align}
	\Delta w_{ji}^l & = x_i\sum_k\delta_k \Pi_h w_{kj}^{h} \label{e} \tag{5}
\end{align}$$

To summarize, $$ \ref{b} $$ represents BP over the output layer & $$ \ref{e} $$ represents BP over h hidden layers
