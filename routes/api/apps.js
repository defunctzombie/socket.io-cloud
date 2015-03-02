var Router = require('express').Router;
var NotFound = require('httperrors').NotFound;
var Forbidden = require('httperrors').Forbidden;
var BadRequest = require('httperrors').BadRequest;
var uuid = require('uuid');

var App = require('iocloud-models/App');

var load_user = require('../../middleware/load_user');
var Cloud = require('../../cloud');

var router = new Router();

router.param('app_id', function(req, res, next, app_id) {
  next();
});

router.route('/')
.all(load_user)
// list users apps
.get(function(req, res, next) {
  var user = req.current_user;

  App.find({ user_id: user.id }, req.error(function(apps) {
    res.json(apps.map(function(app) {
      app._id = undefined;
      app.user_id = undefined;
      return app;
    }));
  }));
})

router.route('/:app_id')
.all(load_user)
// new app
// we use put because we know the app ID
.put(function(req, res, next) {
  var user = req.current_user;
  var app_id = req.params.app_id;

  if (! /^[a-z]([a-z0-9-]{50})?[a-z]$/.test(app_id)) {
    return next(BadRequest('Invalid application name. Only lowercase letters and dashes allowed'));
  }

  var app = new App({
    id: app_id,
    api_key: uuid(),
    user_id: user.id
  });

  App.count({ id: app_id }, req.error(function(count) {
    if (count > 0) {
      return next(BadRequest('Name already taken'));
    }

    app.save(req.error(function() {
      res.json(app);
    }));
  }));

})
// remove an app
.delete(function(req, res, next) {
  var user = req.current_user;
  var app_id = req.params.app_id;

  App.findOne({ id: app_id }, req.error(function(app) {
    if (!app) {
      return next(NotFound());
    }

    if (app.user_id !== user.id) {
      return next(Forbidden());
    }

    app.remove(req.error(function() {
      res.sendStatus(200);
    }));
  }));
});

router.post('/:app_id/events', function(req, res, next) {
  var app_id = req.params.app_id;
  var auth_key = req.headers.authorization;

  if (!auth_key) {
    return next(BadRequest('Authorization header is required'));
  }

  App.findOne({ api_key: auth_key }, req.error(function(app) {
    if (!app) {
      return next(NotFound());
    }

    if (app.id !== app_id) {
      return next(BadRequest('Invalid app id'));
    }

    var body = req.body;
    var namespace = body.namespace;
    var event_name = body.type;
    var payload = body.payload;

    Cloud.emit('message', {
      app: app_id,
      namespace: namespace,
      event: event_name,
      payload: payload
    });

    res.sendStatus(200);
  }));

});

module.exports = router;
