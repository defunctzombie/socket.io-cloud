var Router = require('express').Router;
var BadRequest = require('httperrors').BadRequest;
var validator = require('validator');

var User = require('iocloud-models/User');

var router = new Router();

router.route('/')
.post(function(req, res, next) {

  var email = req.body.email;
  var password = req.body.password;

  if (!validator.isEmail(email)) {
    return next(BadRequest('Please specify a valid email address'));
  }

  if (password === undefined || password.length === 0) {
    return next(BadRequest('Password cannot be blank'));
  }

  // lookup existing user
  User.findOne({ email: email }, req.error(function(user) {
    if (user) {
      return next(BadRequest('User already exists'));
    }

    User.create({
      email: email,
      password: password
    }, req.error(function(user) {
      user = user.toJSON();
      delete user.password_hash;
      delete user._id;
      res.json(user);
    }));
  }));
});

module.exports = router;
