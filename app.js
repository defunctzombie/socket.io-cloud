// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('cloud');
var namespaces = require('./namespaces');

var app = express();

app.use(bodyParser.json());

app.post('/update', function(req,res) {
  var body = req.body;
  var id = body.id;
  var type = body.type;
  var payload = body.payload;

  debug('body is' + body);
  debug('req is ' + req.host);
  // TODO: error checks for invalid id, empty id, empty request -- and add unit tests

  var subDomain= req.hostname;
  debug('Domain is '  + subDomain);
  subDomain = subDomain.substring(0,subDomain.indexOf("."));
  debug('Sub Domain is '  + subDomain);
  var nsp = namespaces[id];
  //nsp.emit(type, payload);
  
  console.dir(nsp);  
  debug(type + ' action had payload: ' + payload);
 
  var i;
  for ( i=0; i <nsp.sockets.length ; i++)
  {
	  var hostName = nsp.sockets[i].handshake.headers.host;
	  hostName = hostName.split(".")[0]; 
	  if ( hostName == subDomain)
	   {
		   nsp.sockets[i].emit(type,payload);
	   }
	   debug("Hostname and subdomain" + hostName + " " + subDomain);
  }
 
  res.json({
    payload: payload
  });

});

module.exports = app;
