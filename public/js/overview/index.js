var dommit = require('dommit');
var serialize = require('form-serialize');

var tmpl = require('./index.html');

var App = require('../models/App');

var OverviewPage = function() {
  if (!(this instanceof OverviewPage)) {
    return new OverviewPage();
  }

  var self = this;
  self.view = dommit(tmpl, { apps: [] }, {
    delegate: self
  });
};

OverviewPage.prototype._init = function() {
  var self = this;

  App.find(function(err, apps) {
    self.view.set('apps', apps);
  });
};

OverviewPage.prototype.on_create_app = function(ev) {
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

    var apps = self.view.get('apps');
    apps.push(app);
  });
};

OverviewPage.prototype.on_delete_app = function(ev, dommit) {
  var self = this;

  var app = dommit.model;
  app.destroy(function(err) {
    if (err) {
      return;
    }

    var apps = self.view.get('apps');
    var idx = apps.indexOf(app);
    if (idx < 0) {
      return;
    }

    apps.splice(idx, 1);
  });
};

OverviewPage.prototype.render = function(el) {
  var self = this;
  self._init();
  self.view.appendTo(el);
};

module.exports = OverviewPage;
