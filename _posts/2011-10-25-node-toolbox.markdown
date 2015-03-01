---
layout: post
title: Node toolbox
published: true
author:  Nilakanta
categories:
- node-toolbox
- node.js
- nodetoolbox
- toolbox
- toolbox.no.de
---

While searching for a node client for CouchDb, we came across quite a few node.js packages. 6 to be precise, to figure out the best fit for our project, we had to do a fair bit of Googleing and look at [Github](http://github.com/) to see which ones are active and better fit for the project.

A lot of projects are defunct, have very little documentation or just experimental. It would be good to go to one place to find the right module and a general feeling of how good the module is.Turns out there is one, the Node Modules Wiki page. It shows simple wiki page that lists modules by categories.

Coming from the Ruby world which has a similar vibrant community and
tons of gems, we felt there needed to be a version of the
awesome [Ruby Toolbox](http://www.ruby-toolbox.com/)

So over a weekend we build a simple version of it and called it [Node
toolbox](http://nodetoolbox.com)


We pulled all the information from the Node Modules page and built the
category mapping of each NPM Module. Whereas [NPM
Registry](http://registry.npmjs.org/) has almost 4500 packages, the
Node Modules Wiki just lists about 1000 of them.

[NPM Registry](http://registry.npmjs.org/) does contain tags filled in
by the package developers, but again only a few of the packages had
this information.  There were more than 500 tags, from these we
created about 100 categories, but merging them into one category,
adding new ones or completely eliminating things we thought did not
make sense. Along the way we removed duplicate tags like
test/tests/Testing and so on.


<img src="/images/packages_for_categories.png" alt="Node toolbox"
     width="600px" />

After putting the modules into their categories, we looked up github
for the repository information, stuff like Watchers and Forks. Which
in our opinion is a good indicator of the Project itself. And are
currently using that to build our module ranking.

<img src="/images/ranked_packages.png" alt="Node toolbox" />

There are a lot of things missing now, The categorization and the categories themselves is arbitrary. We'd like owners of modules to categorize them correctly.


The choice of ranking the modules on github watchers/forks is also arbitrary. We could if it were available somewhere, leverage npm module downloads. User Feedback, repository information such as Open Issues Last commit time, Availability of tests, build status and so on.


As usual, feedback is appreciated and can be tweeted towards [@nodetoolbox](https://twitter.com/#!/nodetoolbox).
