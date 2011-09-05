(function () {
    var cookies = require('cookies'),
        uuid    = require('node-uuid'),
        store   = require('./helpers/sessionstore');

    exports.name = 'default session handler';

    exports.plugin = function (request, response, options) {
        var sessionName    = options.session || 'bricks-session';
        var sessionStore   = options.sessionStore || store;

        var jar = new cookies(request, response, options.keys);
        var sessionId = jar.get(sessionName);

        if (sessionId === undefined) {
            sessionId = uuid();

            jar.set(sessionName, sessionId, options.cookie);
        }

        response.session = sessionStore.get(sessionId) || { };
        
        response._sessionData = {
            sessionStore:   sessionStore,
            sessionName:    sessionName,
            sessionId:      sessionId
        };

        response.on('final.complete', function (event, data) {
            this._sessionData.sessionStore.set(this._sessionData.sessionId, this.session);
        });

        response.next();
    };
})();