// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('chat');
//var EventEmitter = require('events').EventEmitter;

// now needed by 'app'-----------
var SocketIO = require('socket.io');
var io = new SocketIO();

var namespaces = [
    io.of('/ns1'),
    io.of('/ns2'),
    io.of('/ns3')
];

for (i in namespaces) {
    namespaces[i].on('connection', handleConnection(namespaces[i]));
}

function handleConnection(ns) {
    return function (socket) {
        console.log('connected');

      // when the client emits 'new message', this listens and executes
      socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
      });

      // when the client emits 'add user', this listens and executes
      socket.on('add user', function (username) {
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      // when the user disconnects.. perform this
      socket.on('disconnect', function () {
        // remove the username from global usernames list
        if (addedUser) {
          delete usernames[socket.username];
          --numUsers;

          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    }
}

//-------------------------------

// var ee = new EventEmitter();

var app = express();

// Routing -> serve static files from public folder
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());

app.post('/update', function(req,res) {
  var body = req.body;
  var id = body.id;
  var msg = body.message;

  // TODO:error checks for invalid id, empty id, empty request

  // TODO: fix hardcode
  var nsp = namespaces[0];
  nsp.emit('new message', msg);
  console.log('new message was: ' + msg);

  res.json({
    message: body.message
  });
});

module.exports = app;
