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

            appserver.addEventHandler('run.fatal', function (error) { thisp.callback(this.event, error); });
            appserver.addRoute(".+", function () { foo(); });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'should result in a run.fatal event': function (err, data) {
            assert.equal(err, 'run.fatal');
        }
    },
    'error handler called for failed route': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;

            appserver.addEventHandler('route.fatal', function (error) { thisp.callback(this.event, error); });
            appserver.addRoute(function() { foo(); }, function () { foo(); });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'should result in a route.fatal event': function (err, data) {
            assert.equal(err, 'route.fatal');
        }
    }
}).export(module);
