var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');

vows.describe('Run Routes').addBatch({
    'string route added for request': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute("/foo", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, request, response, options) {
            assert.equal(response.statusCode(), 200);
        }
    },
    'string regex route added for request': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, request, response, options) {
            assert.equal(response.statusCode(), 200);
        }
    },
    'plugin route added for request': {
        topic: function () {
            var thisp = this;
            var plugin = { init: function () { }, plugin: function (a,b,c) { thisp.callback(undefined, a, b, c); } };

            var appserver = new server.appserver();
            
            appserver.addRoute("^\/foo", plugin);

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/foo";

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, request, response, options) {
            assert.equal(response.statusCode(), 200);
        }
    },
    'route not fired': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver();
            
            appserver.addRoute("^\/foo", function(a,b,c) { thisp.callback(1,a,b,c); });

            setTimeout(function() { thisp.callback('callback not fired'); }, 50);
            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, request, response, options) {
            assert.equal(err, 'callback not fired');
        }
    },
    'replacing the router with a default true': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute("blah blah blah", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'should cause any route to fire': function (err, request, response, options) {
            assert.equal(err, undefined);
        }
    },
    'events fired at the end of routes': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver();

            var msg = [ ];
            appserver.addRoute(".+", function (request, response) {
                response.on("pre.complete", function () { msg.push("pre.complete"); });
                response.next();
            }, { section: "pre" });
            appserver.addRoute(".+", function (request, response, options) {
                msg.push("main");
                thisp.callback(undefined, msg);
            });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'should be dealt with before the next route starts': function (err, msg) {
            assert.equal(err, undefined);
            assert.equal(msg[0], "pre.complete");
            assert.equal(msg[1], "main");
        }
    }
}).export(module);
