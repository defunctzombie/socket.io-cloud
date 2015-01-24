var httpProxy = require('http-proxy')

var proxy = httpProxy.createProxy();

var options = {  
  'cloud.io/app1': 'app1.cloud.io',
  'cloud.io/app2': 'app2.cloud.io' 

}

require('http').createServer(function(req, res) {  
  console.log(req.headers.host.split(":")[0]);
   proxy.web(req, res, {
	  target: options[req.headers.host.split(":")[0]]
  });
  console.log(req.headers.host);
}).listen(8000);
