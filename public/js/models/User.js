var Model = require('bamboo/model');
var ajax = require('bamboo-sync-ajax');

var User = Model({
  email: String,
  password: String
}, { url_root: '/api/users', sync: ajax });

module.exports = User;
