// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('cloud');

var Cloud = require('./cloud');

var app = express();

app.use(bodyParser.json());

app.post('/update', function(req, res, next) {
  var body = req.body;
  var id = body.id;
  var type = body.type;
  var payload = body.payload;

  var app = body.app;

  debug('app %s', app);

  Cloud.emit('message', {
    app: app,
    namespace: id,
    event: type,
    payload: payload
  });

  res.sendStatus(200);
});

module.exports = app;
