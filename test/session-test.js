var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');

vows.describe('Sessions').addBatch({
    'session handler sets a cookie for empty jar': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;

            appserver.addRoute(/.+/, appserver.plugins.sessionhandler, { section: 'pre' });
            appserver.addRoute(/.+/, function (request, response) { thisp.callback(undefined, response); });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'result is a cookie in the cookie jar': function (err, data) {
            assert.equal(data.getHeader('Set-Cookie').length, 1);
        }
    }
}).export(module);