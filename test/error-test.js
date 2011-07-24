var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');

vows.describe('Errors').addBatch({
    'error handler called for failed run': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;

            appserver.addEventHandler('run.fatal', function (error) { thisp.callback(undefined, error); });
            appserver.addRoute(/.+/, function () { foo(); });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from an error': function (err, data) {
            assert.equal(data, 'run.fatal');
        }
    },
    'error handler called for failed route': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;

            appserver.addEventHandler('route.fatal', function (error) { thisp.callback(undefined, error); });
            appserver.addRoute(function() { foo(); }, function () { foo(); });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from an error': function (err, data) {
            assert.equal(data, 'route.fatal');
        }
    }
}).export(module);