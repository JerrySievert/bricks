var vows      = require('vows'),
    assert    = require('assert'),
    mrequest  = require('./mocks/request'),
    mresponse = require('./mocks/response'),
    response  = require('../lib/response.js');

vows.describe('Response').addBatch({
    'write after final throws exception': {
        topic: function () {
            var res = new mresponse.response();
            var req = new mrequest.request();
            req.url = "/bar";

            var test = new response.response(res, req, [ [], [], [], [] ]);
            test.final();
            
            var ex = false;
            try {
                test.write('');
            } catch (err) {
                ex = true;
            }
            
            return ex;
        },
        'results from run': function (topic) {
            assert.equal(topic, true);
        }
    }
}).export(module);