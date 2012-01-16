var bricks = require('bricks');

var appServer = new bricks.appserver();

// redirect / to /index.html
var redirects = [
  {
    path: "^/$",
    url:  "/index.html"
  }
];

appServer.addRoute(".+", appServer.plugins.redirect, { section: "pre", routes: redirects });

// serve files from htdocs directory
appServer.addRoute(".+", appServer.plugins.filehandler, { basedir: "./htdocs" });

// return 404 for any missing files
appServer.addRoute(".+", appServer.plugins.fourohfour);

// log the results
appServer.addRoute(".+", appserver.plugins.loghandler, { section: 'final', filename: "./logs/access.log" });

var server = appServer.createServer();
server.listen(3000);