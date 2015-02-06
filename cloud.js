var EventEmitter = require('events').EventEmitter;

// Cloud emulates messages received from other instances
// not all cloud.io socket servers and APIs will run on one machine
// this abstracts away posting and consuming cloud messages
var Cloud = function() {
  if (!(this instanceof Cloud)) {
    return new Cloud();
  }

  var self = this;
};

Cloud.prototype.__proto__ = EventEmitter.prototype;

global.cloud = global.cloud || Cloud();
module.exports = global.cloud;
