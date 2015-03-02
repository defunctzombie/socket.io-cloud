var Model = require('bamboo/model');
var ajax = require('bamboo-sync-ajax');

var App = Model({
  api_key: String
}, { url_root: '/api/apps', sync: ajax });

App.prototype.emit_test_event = function() {
  var self = this;

  var opt = {
    method: 'POST',
    url: self.url + '/events',
    headers: {
      'Authorization': self.api_key
    }
  };

  ajax(opt, function(err, res) {
    // TODO ??
  });
};

module.exports = App;
