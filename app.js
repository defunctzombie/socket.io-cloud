// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('chat');
//var EventEmitter = require('events').EventEmitter;


console.log("importing socket io cloud js stuff");

// now needed by 'app'-----------
var SocketIO = require('socket.io');
var io = new SocketIO();

var namespace_list = ['ns1', 'ns2', 'ns3'];

var namespaces = {};

for (i in namespace_list) {
    namespaces[namespace_list[i]] = io.of('/'+namespace_list[i]);
    namespaces[namespace_list[i]].on('connection', handleConnection(namespaces[namespace_list[i]]));
}

function handleConnection(ns) {
    return function (socket) {
        console.log('connected');

      // when the client emits 'new message', this listens and executes
      socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: "hal",
          message: data
        });
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

  console.log('id was: ' + id);

  // TODO:error checks for invalid id, empty id, empty request

  // TODO: fix hardcode
  var nsp = namespaces[id];
  nsp.emit('new message', msg);
  console.log('new message was: ' + msg);

  res.json({
    message: body.message
  });
});

//module.exports = {SocketIOCloud: io, app: app};
//module.exports = app;

var debug = require('debug')('chat');
//var io = require('../io');

var http = require('http');

var server = http.createServer(app);
io.attach(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  debug('Server listening at port %d', port);
});

module.exports = io;
console.log("done loading app.js");
