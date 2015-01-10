var EventEmitter = require('events').EventEmitter;

// singleton pubsub interface
var ee = global.ee = global.ee || new EventEmitter();

module.exports = ee;
