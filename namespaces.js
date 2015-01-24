var io = require('./io');
var debug = require('debug')('cloud');

var namespace_list = ['ns1', 'ns2', 'ns3'];

var namespaces = {};

namespace_list.forEach( function(namespace) {
    namespaces[namespace] = io.of('/'+namespace);
    namespaces[namespace].on('connection', handleConnection(namespaces[namespace]));
});

function handleConnection(ns) {
    return function (socket) {
	    debug(socket.handshake.headers.host);
	    debug('connected');
    }
}

module.exports = namespaces;
