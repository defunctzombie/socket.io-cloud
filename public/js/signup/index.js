var dommit = require('dommit');
var serialize = require('form-serialize');

var User = require('../models/User');
var Session = require('../models/Session');

var tmpl = require('./index.html');

var SignupPage = function() {
  if (!(this instanceof SignupPage)) {
    return new SignupPage();
  }

  var self = this;
  self.view = dommit(tmpl, {}, {
    delegate: self
  });
};

SignupPage.prototype.render = function(el) {
  var self = this;
  self.view.appendTo(el);
};

SignupPage.prototype.destroy = function() {
  var self = this;
  self.view.destroy();
};

SignupPage.prototype.on_signin = function(ev) {
  var self = this;
  self.view.set('error', undefined);

  var form = serialize(ev.target.form, { hash: true });
  self._new_session(form.email, form.password);
};

SignupPage.prototype.on_signup = function(ev) {
  var self = this;

  self.view.set('error', undefined);

  var form = serialize(ev.target.form, { hash: true });

  var new_user = User({
    email: form.email,
    password: form.password
  });

  new_user.save(function(err) {
    if (err) {
      self.view.set('error', err.message);
      return;
    }

    self._new_session(form.email, form.password);
  });
};

SignupPage.prototype._new_session = function(email, password) {
  var self = this;

  var new_session = Session({
    email: email,
    password: password
  });

  new_session.save(function(err) {
    if (err) {
      self.view.set('error', err.message);
      return;
    }

    window.location = '/app';
  });
};

var view = SignupPage();
view.render(document.body);

module.exports = SignupPage;
