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


      console.log('Request received: '+ url_parts.pathname + ' ' + url_parts.query.search);

      if (req.method == 'GET') {
        switch (url_parts.pathname) {
            case '/getConfig':
            	config = ReadConfig();
              Respond(response, config);              
              break;
          
            case '/getVersions':  
              config = ReadConfig();
              var versions = ReadVersions(config.versionsLocation);  
              Respond(response, versions);
              break;
          }
     	}

      // if (req.method == 'POST') {
      //   switch (url_parts.pathname) {
      //     case '/getVersions':
      //         req.on('data', function (dataChunk) {
      //           console.log('received data: ' + dataChunk.toString());
      //           var parsed = JSON.parse(dataChunk);
      //           var versions = ReadVersions(ReadConfig().versionsLocation, parsed.environment);  
      //           Respond(response, versions);
      //         });

      //         req.on('end', function() {
      //           console.log('request end');
      //           response.writeHead(200, "OK", {'Content-Type': 'text/html'});
      //           response.end();
      //         });
      //         break;
      //   }
      // }

  })
 .listen(4242);

function ReadConfig () {
 	var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
 	console.log(config);
 	return config;
 };

function ReadVersions (versionsLocation) {
  console.log('reading versions: ' + versionsLocation);
  return fs.readdirSync(versionsLocation);
};

 function Respond (response, responseData) {
    var stringifiedResponse = JSON.stringify(responseData);
    console.log(stringifiedResponse);
    response.writeHead(200, { 'Content-Type': 'application/json' });   
    response.write(stringifiedResponse);
    response.end();
 }
