var Router = require('express').Router;
var assert = require('assert');
var uuid = require('uuid');
var BadRequest = require('httperrors').BadRequest;

var User = require('iocloud-models/User');
var Session = require('iocloud-models/Session');

var router = new Router();

router.route('/')
.post(function(req, res, next) {

  var email = req.body.email;

  // lookup existing user
  User.findOne({ email: email }, req.error(function(user) {
    if (!user) {
      return next(BadRequest('User account does not exist.'));
    }

    req.user = user;
    next();
  }));
})
.post(function(req, res, next) {
  assert(req.user);
  var user = req.user;
  var password = req.body.password;

  user.verify_password(password, req.error(function(valid) {
    if (!valid) {
      return next(BadRequest('Password is not correct.'));
    }

    var session = new Session({
      id: uuid(),
      user_id: user.id
    });

    session.save(req.error(function() {
      req.session.id = session.id;
      req.session.user_id = user.id;

      res.json(session);
    }));
  }));
});

module.exports = router;
