// var http = require("http");
// http.createServer(function(request, response) {  
//   response.writeHead(200, {"Content-Type": "text/plain"});  
//   response.write("Hello from the Node.js server!");  
//   response.write
//   response.end();
// }).listen(8080);
// console.log('Server is listening to http://localhost/ on port 8080…');



// var connect = require('connect');
// connect.createServer( function (req, res) {
// 	console.log('test');
// }
//     connect.static("c:\\source\\Ploy")
// ).listen(4242);
var config;
var connect = require('connect');
var fs = require('fs');
var url = require('url');

var app = connect()
  //.use(connect.logger('dev'))
  .use(connect.static('c:\\source\\Ploy'))
  .use(function(req, response){
  	  var url_parts = url.parse(req.url, true);
      if (req.method == 'GET') {
        switch (url_parts.pathname) {
            case '/getConfig':
            	config = ReadConfig();
            	var stringified = JSON.stringify(config);
            	console.log(stringified);
            	response.writeHead(200, { 'Content-Type': 'application/json' });   
            	response.write(stringified);
            	response.end();
            break;
          }
     	}

  	console.log('Request received: '+ req);
    
    response.end('hello world\n');

  })
 .listen(4242);

 function ReadConfig () {
 	config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
 	console.log(config);
 	return config;
 }
