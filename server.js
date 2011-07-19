var app = require('./lib/appserver');
var appServer = new app.appserver();

appServer.addRoute(/.+/, appServer.plugins.redirect, { section: 'pre', routes: [ { path: "/foo", url: "http://legitimatesounding.com/" }]});
appServer.addRoute(/.+/, appServer.plugins.filehandler, { basedir: '.' });
appServer.addRoute(/.+/, appServer.plugins.fourohfour);
appServer.addRoute(/.+/, appServer.plugins.loghandler, { section: 'final', filename: 'logs/access.log' });
var server = appServer.createServer();
server.listen(3000);
