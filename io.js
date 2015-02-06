var debug = require('debug')('cloud');
var SocketIO = require('socket.io');

var Cloud = require('./cloud');

var io = global.io = global.io || new SocketIO();

io.useNamespaceValidator(function(nsp, next) {
    var nsp = io.of(nsp);
    nsp.on('connect', function(socket) {
        var host = socket.handshake.headers.host;
        var subdomain = host.substring(0, host.indexOf('.'));
        var name = nsp.name;

        function msg_handler(details) {
            if (details.app !== subdomain || details.namespace !== name) {
                return;
            }

            socket.emit(details.event, details.payload);
        };

        Cloud.on('message', msg_handler);

        debug('new host connected for %s %s', subdomain, name);
        socket.once('disconnect', function() {
            debug('disconnected %s %s', subdomain, name);
            Cloud.removeListener('message', msg_handler);
        });
    });

    next(null, true);
});

io.on('connect', function(socket) {
    // do we need this?
});

module.exports = io;
