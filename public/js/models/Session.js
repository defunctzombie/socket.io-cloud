var Model = require('bamboo/model');
var ajax = require('bamboo-sync-ajax');

var Session = Model({
  email: String,
  password: String
}, { url_root: '/api/sessions', sync: ajax });

module.exports = Session;
