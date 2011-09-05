var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');

vows.describe('Injections').addBatch({
    'when overwriting the callRoute functionality in response': {
        topic: function () {
            var thisp = this;
            var callRoute = function () { thisp.callback(undefined, 'called'); };
            var appserver = new server.appserver({ callRoute: callRoute });
            appserver.addRoute("/foo", function (request, response, options) { 
            });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, result) {
            assert.equal(result, 'called');
        }
    }
}).export(module);