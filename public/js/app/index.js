var dommit = require('dommit');

var tmpl = require('./index.html');

var AppView = require('./AppView');
var Navbar = require('./Navbar');

var App = require('../models/App');

var OverviewPage = function() {
  if (!(this instanceof OverviewPage)) {
    return new OverviewPage();
  }

  var self = this;
  self.app_view = AppView();
  self.navbar = Navbar();

  self.view = dommit(tmpl, { apps: [] }, {
    delegate: self,
    bindings: {
      'data-view': function(el, prop) {
        var binding = this;
        binding.change(function() {
          var val = binding.value(prop);
          if (!val) {
            return;
          }

          val = val.element();
          el.parentNode.replaceChild(val, el);
          el = val;
        });
      }
    }
  });

  self.app_view.on('destroyed', function(app) {
    var apps = self.view.get('apps');
    var idx = apps.indexOf(app);
    if (idx < 0) {
      return;
    }

    apps.splice(idx, 1);
    if (apps.length == 0) {
      self.app_view.set_app(null);
      return;
    }

    self.show_app(apps[0]);
  });

  self.navbar.on('new app', function(app) {
    var apps = self.view.get('apps');
    apps.push(app);
  });
};

OverviewPage.prototype._init = function() {
  var self = this;

  App.find(function(err, apps) {
    if (err) {
      return;
    }

    if (apps.length == 0) {
      return;
    }

    var app = apps[0];
    app.active = true;

    self.view.set('apps', apps);
    self.app_view.set_app(app);
  });
};

OverviewPage.prototype.on_show_app = function(ev, dommit) {
  var self = this;

  var new_app = dommit.model;
  self.show_app(new_app);
};

OverviewPage.prototype.show_app = function(new_app) {
  var self = this;
  var apps = self.view.get('apps');
  apps.forEach(function(app) {
    app.active = app.id == new_app.id;
  });
  self.view.set('apps', apps);
  self.app_view.set_app(new_app);
};

OverviewPage.prototype.render = function(el) {
  var self = this;
  self._init();
  self.view.appendTo(el);
};

var view = OverviewPage();
view.render(document.body);

module.exports = OverviewPage;
