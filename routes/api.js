var body_parser = require('body-parser');
var Router = require('express').Router;

var Cloud = require('../cloud');

var router = new Router();

router.use(body_parser.json());

router.param('app_id', function(req, res, next, app_id) {
  next();
});

router.post('/apps/:app_id/events', function(req, res, next) {

  // body
  // body.namespace // namespace
  // body.name // event name
  // body.data // event data

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

module.exports = router;
