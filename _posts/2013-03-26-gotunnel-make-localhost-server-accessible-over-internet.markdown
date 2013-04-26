--- 
layout: post
title: "Gotunnel: make localhost server accessible over internet"
description: Gotunnel allows you to share server running on localhost, over the net. Supports http, https and websocket.
published: true
author: ciju
categories: [Golang, localtunnel, tech]
---

Check the [Github repo](http://github.com/ciju/gotunnel) for
installation and usage instructions.

## The problem ##

On the internet, to access a server, you need its IP address and
port. Your local machine might be running behind a
[NAT](http://en.wikipedia.org/wiki/Network_address_translation). So, a
server running on your local machine, might not be addressable from
internet (ex: no publically visible IP). This is where localtunnel
comes in. It makes the local server accessible over an IP (and port),
on the internet.

Core idea of the solution is that a client from localhost could keep a
connection with a server on the internet. 

This connection could be used by server to forward requests. Gotunnel
utilizes this by running a client on localhost. This Gotunnel Client
connects to the Gotunnel Server accessible on the net. It also
connects to the App server. Gotunnel Clients role is to receive
requests from Gotunnel Server, and forward them to App Server.

Lets start with a (slightly incomplete) picture of the whole
architecture. (Except for small changes, picture is copied from
[Localtunnel protocol doc](https://github.com/progrium/localtunnel/blob/master/PROTOCOL.md)). Keep this picture in mind, while we delve into more details.

             +--------------------+
             | Gotunnel Server    |
             |--------------------|         +---------+
             | Backend | Frontend |<--------+ Browser |
             +---------+----------+         +---------+
                ^  ^^
                |  ||
                |  ||
         Control|  ||Proxy
      Connection|  ||Connections
                |  || 
         +------|  ||-----------------------------------+
         |   +--+--++----------+         +------------+ |
         |   | Gotunnel Client +-------->| App Server | |
         |   +-----------------+         +------------+ |
         |                                              |
         |                  localhost                   |
         +----------------------------------------------+
         
What we want is for the App Server to be accessible from (lets say) a
browser. Since it can't be accessed from outside the localhost, we
have a client in localhost, which is connected with the Gotunnel
server, and can connect to the App Server whenever needed.

Lets examine the case where only a single App Server needs to be made
accessible on the net. The client could (at startup) connect the
Gotunnel Server, and setup a Control Connection. Gotunnel Server, on
receiving a request from Browser, would let Gotunnel Client know about
it, via the Control Connection. Gotunnel Client would respond by
creating a new connection with Gotunnel Server, which will we used as
a Proxy Connection. Gotunnel Server would then tunnel the request via
the Proxy Connection. All this is happening at the TCP level (and
hence supporting HTTP/S & WebSocket).

To support multiple clients, Gotunnel would have to differentiate
between requests for different App Servers, and keep account of
Control Connections associated with respective Clients. Like
[Localtunnel](http://progrium.com/localtunnel/), Gotunnel Server
associates Clients (and in turn App Servers) with subdomains of the
Server.

To look at it from another perspective, lets consider the lifecycle of
Gotunnel Server and Client. Lets first look at Gotunnel Client. When a
client connects to Gotunnel Server, server sends back a
subdomain. This is useless to client itself, except to show it on
console, for you to share it with others. Any request to that
subdomain, server will route to the particular client. And client in
turn, to the App server. Response goes back via the same connections.

Gotunnel Server is basically listening for two kinds of
connections. Its listening for subdomain requests, to route to the
particular client, associated with the subdomain. And its listening
for connections from new clients, and when a new client connects it
assigns the requested (or newly generated) subdomain to the particular
client.

All the connection routing etc is done at TCP level. What this means
is that the connection, in most parts, doesn't have to worry about the
application layer protocol. Example, there is no separate code to
support WebSocket. The only part where we have to deal with the
application layer level protocol intricacies, is to get the
[Host](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Client_request).
We need the host to get the subdomain, for the request. In case of
HTTP and WebSocket[^3], we do this by parsing first few hundred bytes
of the request, to get the headers. HTTPS is more difficult. In case
of HTTPS headers themselves are (or might be?) encrypted. But in our
trials, the host string was still sent in ascii. So, if we can't parse
headers, we just fall back to a regular expression match. Since the
domain of the request is known, we can be somewhat specific in the
regular expression. In other words, if you dont need subdomain
parsing, (ex: a server which to which only one client can be
connected), then there is no need for parsing. And he solution can be
simpler.

Routing at TCP level has atleast one problem. It might not be possible
to do connection pooling. Ex: We don't know when a request or response
ends (unless we deal with the application layer protocol). So, the
only way to know the end of connection, is if the TCP connection is
closed. In other words, we won't be able use the same TCP connection to tunnel
multiple TCP connections.

[^1]: There are other options also, like
[tunnlr](https://tunnlr.com/), [nodejs
localtunnel](http://shtylman.com/localtunnel/),
[pagekite](http://pagekite.net), [forwardhq](https://forwardhq.com/)
etc. 

[^2]: Now it does.

[^3]: WebSocket starts as a HTTP connection. So, the process of getting HOST is same for both.

