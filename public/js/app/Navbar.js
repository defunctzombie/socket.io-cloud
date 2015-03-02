var Dommit = require('dommit');
var Emitter = require('emitter');

var tmpl = require('./Navbar.html');
var NewAppDialog = require('./NewAppDialog');

var Navbar = function() {
  if (!(this instanceof Navbar)) {
    return new Navbar();
  }

  var self = this;
  self.model = {
    email: CLOUD.user.email
  };

  self.view = Dommit(tmpl, self.model, {
    delegate: self
  });
};

Emitter(Navbar.prototype);

Navbar.prototype.on_new_app = function() {
  var self = this;

  NewAppDialog(function(app) {
    self.emit('new app', app);
  });
};

Navbar.prototype.element = function() {
  var self = this;
  return self.view.el;
};

module.exports = Navbar;
