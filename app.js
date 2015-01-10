// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var pubsub = require('./lib/pubsub');
var debug = require('debug')('chat');
//var EventEmitter = require('events').EventEmitter;

// var ee = new EventEmitter();

var app = express();

// Routing -> serve static files from public folder
app.use(express.static(__dirname + '/public'));


// API example -------------------------------------

app.use(bodyParser.json());

app.post('/api/messages', function(req,res) {
  var body = req.body;
  pubsub.emit('message', body.message);
  debug('finish ee emit');

  res.json({
    message: body.message
  });
});

//--------------------------------------------------

module.exports = app;
