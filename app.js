// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('cloud');
var namespaces = require('./namespaces');

var app = express();

// Routing -> serve static files from public folder
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.post('/update', function(req,res) {
  var body = req.body;
  var id = body.id;
  var type = body.type;
  var msg = body.message;

  debug('id was: ' + id);

  // TODO:error checks for invalid id, empty id, empty request

  var nsp = namespaces[id];
  nsp.emit(type, msg);
  debug(type + ' action had payload: ' + msg);

  res.json({
    payload: msg
  });
});

module.exports = app;
