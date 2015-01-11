
# Socket.IO Cloud

A cloud server for socket.io

## How to use

```
$ cd socket.io-cloud
$ npm install
$ node bin/cloud
```

After the socket.io cloud server is running, set up your application to connect on `http://localhost:3000`.
You can change the port from 3000 by supplying the `PORT` env variable.
First, provide the socket.io resources to your application.
---
$ <script src="http://localhost:3000/socket.io/socket.io.js"></script>
---
Then, create the socket connection by putting the following into the client-side javascript.
---
$ var socket = io("http://localhost:3000/namespace.id
--- 

See socket.io-cloud-examples for a simple app example that uses the socket.io cloud.


## Features

- Enables developers to host dynamic content without loading the resources for socket.io
