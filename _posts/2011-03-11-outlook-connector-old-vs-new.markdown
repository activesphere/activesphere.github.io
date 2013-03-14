--- 
layout: post
title: Restful design, Open formats and an Outlook Add-In
published: true
author:  Suresh Harikrishnan
categories: 
- outlook 
- projects 
- rest 
--- 

We mostly work with startups, and most prefer using dynamic languages
like Ruby and Python. Occasionally though, we have worked on .NET/Java
projects because they were really interesting. One such project was to
build an Outlook add-in to synchronize mails, contacts and calendar to
a CRM system. There was already an existing add-in we were replacing,
because it had lots of bugs, and its performance was bad. We analyzed
the problems with the existing design and moved towards a more
[RESTful](http://en.wikipedia.org/wiki/REST) design. Using a RESTful
design helped us in several ways:

**1. Crisp protocol between server and client**.

The existing plugin and the server communicated over a SOAP based
protocol. The protocol was RPCish, and this resulted in the protocol
being very chatty. We were pretty sure that this would have caused
performance issues for even moderate data. This also meant that there
was a tight coupling between the server and the client - more service
methods under contract makes it difficult to change either of the
service or the client code independently.

To avoid these problems, we exposed the server code as a RESTful web
service. We identified resources (Appointments, Contacts and Emails)
and standard operations available on these - using HTTP verbs
(GET/POST/DELETE/PUT). The behaviour of these methods are
well-understood. The fact that the service was over HTTP, makes it
easy to implement the client - most libraries come with a standard
HTTP client class. .NET exposes a very good HTTP Client as well.

We did break the REST in a couple of ways - we used POST as a "patch"
method equivalent and had to introduce a "keep" method to explicitly
synchronize the appointments due to 2 reaons: a) Outlook add-in APIs
don't provide hooks to deletions on the client in a clean way and b)
avoid client-side performance issues.

**2. Server client responsibilities**

One of the nice side-effects of REST is that, when you identify the
resources correctly, the responsibility of the server and client falls
in place - server lists the contacts/appointments when requested for
the list of these and updates the resources when it receives a
POST. The server is not responsible for making sure that the sync
happens correctly, it is the responsibility of the client. Keeping
track of the synchronization - last synchronization time, time
differences between the server and client etc, are again the
responsibilities of the client.

The older add-in code stored the IDs of the outlook
appointments/contacts/emails on the server. First of all, this
information does not belong to the server, and then this also ties the
server to a particular client. We avoided this to allow for
synchronizations across multiple clients at the same time. This
enables the users to install the same client on more than one machine,
and still keeping all different systems in sync.

**3. Open formats and standards**

This was one of the first decisions we made, as this would help in
better interoperability. Individual contacts were represented using
[vCard](http://en.wikipedia.org/wiki/VCard), appointments using
iCalendar formats. This made it possible to subscribe to the
appointments from any device that supports the iCalendar over HTTP -
iPhone, Android and other smart phones, Mac OS X and Linux. We looked
at using [SyncML](http://en.wikipedia.org/wiki/SyncML) and
[ActiveSync](http://en.wikipedia.org/wiki/ActiveSync) protocols for
the synchronizations. ActiveSync was out of question, as it was a
proprietory. We finally ended up using a custom XML based protocol for
emails and contacts, as there was no easily implementable standards
for them.

**Challenges**

Testing in general was a challenge on this project. Outlook add-in
APIs are basically wrappers over COM based APIs. These COM objects are
inherently untestable. Mocking wasn't of much help, as we were
starting to see unmaintainable tests with very little value. We tried
to get some automated functional tests using a library called
[White](http://white.codeplex.com/). But Outlook UI turned out to be
very difficult to automate, and the effort in writing these tests was
too much to be beneficial.

Another challenge was the limitations of the Outlook APIs (there is no
easy way to get notified of deletions), the fact that we had different
synchronization strategies for Contacts, Appointments and Emails
didn't help the cause either.

