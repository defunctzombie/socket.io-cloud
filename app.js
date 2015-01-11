// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('cloud');
var namespaces = require('./namespaces');

var app = express();

app.use(bodyParser.json());

app.post('/update', function(req,res) {
  var body = req.body;
  var id = body.id;
  var type = body.type;
  var payload = body.payload;

  debug('id was: ' + id);

  // TODO: error checks for invalid id, empty id, empty request -- and add unit tests

  var nsp = namespaces[id];
  nsp.emit(type, payload);
  debug(type + ' action had payload: ' + payload);

  res.json({
    payload: payload
  });
});

module.exports = app;
