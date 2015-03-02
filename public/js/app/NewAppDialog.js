var Dommit = require('dommit');
var serialize = require('form-serialize');

var App = require('../models/App');

var tmpl = require('./NewAppDialog.html');

var NewAppDialog = function(fn) {
  if (!(this instanceof NewAppDialog)) {
    return new NewAppDialog(fn);
  }

  var self = this;
  self._fn = fn;
  self.view = Dommit(tmpl, {}, {
    delegate: self
  });

  self.view.appendTo(document.body);
  self.view.el.querySelector('input').focus();
};

NewAppDialog.prototype.on_submit = function(ev) {
  var self = this;

  var form = serialize(ev.target, { hash: true });

  var app = App({
    id: form.name
  });

  app.save(function(err) {
    if (err) {
      self.view.set('error', err.message);
      return;
    }

    // avoid callback from happening inside our stack
    setTimeout(function() {
      self._fn(app);
    }, 0);
    self.view.destroy();
  });

};

NewAppDialog.prototype.on_cancel = function() {
  var self = this;
  self.view.destroy();
};

module.exports = NewAppDialog;
