var bricks = require('bricks');
   
var appServer = new bricks.appserver();

// respond to /hello
appServer.addRoute("/hello", function(request, response) {
    response.write("Hello World!");
    response.end();
});

// 404 for everything else
appServer.addRoute(".+", appServer.plugins.fourohfour);

var server = appServer.createServer();
server.listen(3000);