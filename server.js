require('date-utils');

var app = require('./lib/appserver');

var appServer = new app.appserver();

appServer.addRoute(/.+/, appServer.plugins.sessionhandler, { cookie: { expires: new Date().addYears(1), httpOnly: false } });
appServer.addRoute(/.+/, appServer.plugins.filehandler, { basedir: '.' });
appServer.addRoute(/.+/, appServer.plugins.fourohfour);
var server = appServer.createServer();
server.listen(3000);
