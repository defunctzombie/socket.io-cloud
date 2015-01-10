// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('chat');


// now needed by 'app'-----------
var SocketIO = require('socket.io');
var io = new SocketIO();

var namespace_list = ['ns1', 'ns2', 'ns3'];

var namespaces = {};

namespace_list.forEach( function(namespace) {
    namespaces[namespace] = io.of('/'+namespace);
    namespaces[namespace].on('connection', handleConnection(namespaces[namespace]));
});

function handleConnection(ns) {
    return function (socket) {
        console.log('connected');
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
  var type = body.type;
  var msg = body.message;

  console.log('id was: ' + id);

  // TODO:error checks for invalid id, empty id, empty request

  var nsp = namespaces[id];
  nsp.emit(type, msg);
  console.log(type + 'action had payload: ' + msg);

  res.json({
    message: msg
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
