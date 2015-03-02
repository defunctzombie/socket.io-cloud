var Dommit = require('dommit');
var Emitter = require('emitter');
var multiline = require('multiline');

var tmpl = require('./AppView.html');

var client_code = multiline(function() {/*
<script src="//cloud.defunctzombie.com/socket.io/socket.io.js"></script>
<script>
var socket = io('ws://app-name.cloud.defunctzombie.com/news');
socket.on('story', function (data) {
    console.log(data);
});
</script>
*/});

var server_code = multiline(function() {/*
POST cloud.defunctzombie.com/api/apps/<app-name>/events
Authorization: <your api key>

{
  namespace: '/news',
  event: 'story',
  data: {
    title: 'cloud io released',
    author: 'Grumpy Cat'
  }
}

*/});

var AppView = function() {
  if (!(this instanceof AppView)) {
    return new AppView();
  }

  var self = this;
  self.client_code = hljs.highlight('html', client_code).value;
  self.server_code = hljs.highlight('html', server_code).value;

  self.view = Dommit(tmpl, {}, {
    delegate: self
  });
};

Emitter(AppView.prototype);

// set the app to show
AppView.prototype.set_app = function(app) {
  var self = this;
  self.view.set('app', app);
};

AppView.prototype.on_delete = function() {
  var self = this;

  var app = self.view.get('app');
  if (!app) {
    return;
  }

  app.destroy(function(err) {
    if (err) {
      return;
    }

    self.emit('destroyed', app);
  });
};

AppView.prototype.on_emit_test_event = function() {
  var self = this;

  var app = self.view.get('app');
  if (!app) {
    return;
  }

  app.emit_test_event();
};

AppView.prototype.element = function() {
  var self = this;
  return self.view.el;
};

module.exports = AppView;
