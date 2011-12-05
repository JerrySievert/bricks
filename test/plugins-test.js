var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response'),
    fs        = require('fs');

vows.describe('Plugins').addBatch({
    '404 plugin called': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            appserver.addRoute(".+", appserver.plugins.fourohfour);
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run are a 404': function (err, request, response, options) {
            assert.equal(response.statusCode(), 404);
        }
    },
    'redirect handler called for permanent redirect': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            var redirects = {
                section: "pre",
                routes: [ {
                    path:      ".+",
                    url:       'http://foo.com/bar',
                    permanent: true
                } ]
            };

            appserver.addRoute(".+", appserver.plugins.redirect, redirects);
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run are a 301': function (err, request, response, options) {
            assert.equal(response.statusCode(), 301);
        }
    },
    'redirect handler called for temporary redirect': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            var redirects = {
                section: "pre",
                routes: [ {
                    path: ".+",
                    url:  'http://foo.com/bar'
                } ]
            };

            appserver.addRoute(".+", appserver.plugins.redirect, redirects);
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'results from run are a 307': function (err, request, response, options) {
            assert.equal(response.statusCode(), 307);
        }
    },
    'filehandler can read a file': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            appserver.addRoute(".+", appserver.plugins.filehandler, { basedir: __dirname });
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/document";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'file is set': function (err, request, response, options) {
            assert.equal(response._actual.response.get('buffer'), 'Hello World!');
        }
    },
    'filehandler continues on if there is no data': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            appserver.addRoute(".+", appserver.plugins.filehandler, { basedir: __dirname });
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/foo";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'buffer is empty': function (err, request, response, options) {
            assert.equal(response._actual.response.get('buffer'), undefined);
        }
    },
    'filehandler sets correct Last-Modified header': {
        topic: function () {
            var appserver = new server.appserver();
            var thisp = this;
            
            appserver.addRoute(".+", appserver.plugins.filehandler, { basedir: __dirname });
            appserver.addRoute(".+", function (request, response, options) { 
                thisp.callback(undefined, request, response, options);
            }, { section: "final" });

            var req = new mrequest.request();
            req.url = "/document";
            var res = new mresponse.response();

            appserver.handleRequest(req, res, appserver);
        },
        'date is set correctly': function (err, request, response, options) {
            var stats = fs.statSync(__dirname + "/document");
            assert.equal(response._headers['Last-Modified'], stats.mtime.toUTCString());
        }
    }
}).export(module);