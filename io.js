var debug = require('debug')('cloud');
var SocketIO = require('socket.io');

// io is a Socket IO singleton

var io = global.io = global.io || new SocketIO();

module.exports = io;
