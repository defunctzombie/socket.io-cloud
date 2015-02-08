var Model = require('bamboo/model');
var ajax = require('bamboo-sync-ajax');

var App = Model({
  api_key: String
}, { url_root: '/api/apps', sync: ajax });

module.exports = App;
