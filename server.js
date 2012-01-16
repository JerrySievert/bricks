var Cromag = require('cromag');

var app = require('./lib/appserver');

var appServer = new app.appserver();

appServer.addRoute(/.+/, appServer.plugins.sessionhandler, { cookie: { expires: new Cromag().addYears(1), httpOnly: false } });
appServer.addRoute(/.+/, appServer.plugins.filehandler, { basedir: '.' });
appServer.addRoute(/.+/, appServer.plugins.fourohfour);
var server = appServer.createServer();
server.listen(3000);
