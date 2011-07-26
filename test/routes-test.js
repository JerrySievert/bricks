var vows      = require('vows'),
    assert    = require('assert'),
    server    = require('../lib/appserver');

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
    }
}).export(module);