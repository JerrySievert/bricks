var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');

vows.describe('Events').addBatch({
    'event fired for pre end complete': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute(".+", function (request, response, options) {
                response.on('pre.complete', function (event, response) {
                    thisp.callback(undefined, event);
                });
                response.end();
            }, { 'section': 'pre' });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, event) {
            assert.equal(event, 'pre.complete');
        }
    },
    'event fired for main end complete': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute("/foo", function (request, response, options) {
                response.on('main.complete', function (event, response) {
                    thisp.callback(undefined, event);
                });
                response.end();
            }, { 'section': 'main' });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, event) {
            assert.equal(event, 'main.complete');
        }
    },
    'event fired for post end complete': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute("/foo", function (request, response, options) {
                response.on('post.complete', function (event, response) {
                    thisp.callback(undefined, event);
                });
                response.end();
            }, { 'section': 'post' });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, event) {
            assert.equal(event, 'post.complete');
        }
    },
    'event fired for final end complete': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            appserver.addRoute("/foo", function (request, response, options) {
                response.on('final.complete', function (event, response) {
                    thisp.callback(undefined, event);
                });
                response.end();
            }, { 'section': 'final' });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run': function (err, event) {
            assert.equal(event, 'final.complete');
        }
    }
}).export(module);