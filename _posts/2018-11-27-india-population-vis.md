---
title: "Population of India"
subtitle: "A Visual Exploration of 2010 census data"
author: ciju
published: true
header_hero: /public/images/india-population.svg
---



Initial version of this blog was written few years back. Since then, once in a
while I would tinker with the visualisation, with the hope to share it. There
are two things which make me want to share it. 1. It was the first time that I
had explored data with visualiation, and came up with unanswered questions. 2.
The visualization changed gradually, as a particular sorry emerged. This blog is
an example of data and visualization interplay. You might read the blog to gain
a perspective on the data (2011 census of India) or to understand the interplay
of data and visualization.


Initial version of this was done few years back. Once in a while, I would tinker
with the visualisation, with the hope of sharing it sometime.

Colleague of mine ([Anantha Kumaran](https://ananthakumaran.in)) did some
[visualizations](https://ananthakumaran.in/visualization/) of census data. One
of them, [about the age
distribution](https://ananthakumaran.in/visualization/population/age/), looked
interesting. That was the starting point of my exploration.


### Lets start with the data.

The Indian census for 2011 has data at district level. But we will only look at
state level data. As an example, here are 2 entries from the data that we will
be trying to visualize. There are possibilities of many more visual, with the
census data. This is just one option.


<table className="mv3" style="border-collapse: collapse">
<tbody style="font-size: .8em">
<tr>
<th>State</th>
<th>Age</th>
<th>Female population</th>
<th>Male population</th>
</tr>
<tr>
<td>Bihar</td>
<td>20</td>
<td>1110387</td>
<td>1239346</td>
</tr>
<tr>
<td>Jammu & Kashmir</td>
<td>30</td>
<td>152274</td>
<td>163327</td>
</tr>
</tbody>
</table>


### Population count by age

There are 4 dimentions we can explore. **State**, **age**, **gender** and size
of **population**. If it was total population split by age, we could have
plotted it as a bar chart with <code>x</code> axis as age, and <code>y</code>
axis as the population size, and shown <a
href="https://en.wikipedia.org/wiki/Small_multiple"> small multiples </a> for
each state. E.g. Visualization of india's total population.
