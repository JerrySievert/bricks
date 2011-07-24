(function () {
    var cookies = require('cookies'),
        uuid    = require('node-uuid'),
        handler = require('./helpers/sessionstore');


    exports.plugin = function (request, response, options) {
        var sessionName    = options.session || 'bricks-session';
        var sessionHandler = options.sessionHandler || handler;

        var jar = new cookies(request, response);
        var sessionId = jar.get(sessionName);

        if (sessionId === undefined) {
            sessionId = uuid();

            jar.set(sessionName, sessionId, options.cookie);
        }

        response.session = sessionHandler.get(sessionId) || { };
        
        response._sessionData = {
            sessionHandler: sessionHandler,
            sessionName:    sessionName,
            sessionId:      sessionId
        };

        response.on('final.complete', function (event, data) {
            this._sessionData.sessionHandler.set(this._sessionData.sessionId, this.session);
        });

        response.next();
    };
})();