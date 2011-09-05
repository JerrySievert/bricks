var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response');
    

vows.describe('Add Routes').addBatch({
    'initial appserver': {
        topic: function () {
            var appserver = new server.appserver();
            return appserver.getRoutes();
        },
        'has four empty routes': function (topic) {
            assert.equal(topic.length, 4);
            assert.equal(topic[0].length, 0);
            assert.equal(topic[1].length, 0);
            assert.equal(topic[2].length, 0);
            assert.equal(topic[3].length, 0);
        }
    },
    'can add a route to pre': {
        topic: function () {
            var appserver = new server.appserver();
            appserver.addRoute(".+", function () { }, { section: 'pre' });
            return appserver.getRoutes();
        },
        'has an entry in pre': function (topic) {
            assert.equal(topic.length, 4);
            assert.equal(topic[0].length, 1);
            assert.equal(topic[1].length, 0);
            assert.equal(topic[2].length, 0);
            assert.equal(topic[3].length, 0);
        }
    },
    'can add a route to main': {
        topic: function () {
            var appserver = new server.appserver();
            appserver.addRoute(".+", function () { }, { section: 'main' });
            return appserver.getRoutes();
        },
        'has an entry in routes': function (topic) {
            assert.equal(topic.length, 4);
            assert.equal(topic[0].length, 0);
            assert.equal(topic[1].length, 1);
            assert.equal(topic[2].length, 0);
            assert.equal(topic[3].length, 0);
        }
    },
    'can add a route to post': {
        topic: function () {
            var appserver = new server.appserver();
            appserver.addRoute(".+", function () { }, { section: 'post' });
            return appserver.getRoutes();
        },
        'has an entry in post': function (topic) {
            assert.equal(topic.length, 4);
            assert.equal(topic[0].length, 0);
            assert.equal(topic[1].length, 0);
            assert.equal(topic[2].length, 1);
            assert.equal(topic[3].length, 0);
        }
    },
    'can add a route to final': {
        topic: function () {
            var appserver = new server.appserver();
            appserver.addRoute(".+", function () { }, { section: 'final' });
            return appserver.getRoutes();
        },
        'has an entry in final': function (topic) {
            assert.equal(topic.length, 4);
            assert.equal(topic[0].length, 0);
            assert.equal(topic[1].length, 0);
            assert.equal(topic[2].length, 0);
            assert.equal(topic[3].length, 1);
        }
    },
    'a route added to pre as top': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback('wrong one');
            }, { section: "pre" });

            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback("ok");
            }, { section: "pre", top: true });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'fires in the correct order': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to main as top': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback('wrong one');
            }, { section: "main" });

            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback("ok");
            }, { section: "main", top: true });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'fires in the correct order': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to post as top': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback('wrong one');
            }, { section: "post" });

            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback("ok");
            }, { section: "post", top: true });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'fires in the correct order': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to final as top': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback('wrong one');
            }, { section: "final" });

            appserver.addRoute(".+", function (request, response, options) {
                thisp.callback("ok");
            }, { section: "final", top: true });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'fires in the correct order': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to pre': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                try {
                    response.write('test');
                    thisp.callback("ok");
                } catch (error) {
                    thisp.callback("error");
                }
            }, { section: "pre" });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'can write without error': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to main': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                try {
                    response.write('test');
                    thisp.callback("ok");
                } catch (error) {
                    thisp.callback("error");
                }
            }, { section: "main" });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'can write without error': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to post': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                try {
                    response.write('test');
                    thisp.callback("ok");
                } catch (error) {
                    thisp.callback("error");
                }
            }, { section: "post" });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'can write without error': function (err, request, response, options) {
            assert.equal(err, "ok");
        }
    },
    'a route added to final': {
        topic: function () {
            var thisp = this;

            var appserver = new server.appserver({ checkRoute: function () { return true; } });
            
            appserver.addRoute(".+", function (request, response, options) {
                try {
                    response.write('test');
                    thisp.callback("ok");
                } catch (error) {
                    thisp.callback("error");
                }
            }, { section: "final" });

            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            appserver.handleRequest(req, res, appserver);
        },
        'cannot write without error': function (err, request, response, options) {
            assert.equal(err, "error");
        }
    }
}).export(module);