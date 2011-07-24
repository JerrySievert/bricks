(function () {
    var store = { };

    exports.set = function (sessionId, data) {
        store[sessionId] = data;
    };

    exports.get = function (sessionId) {
        return store[sessionId];
    };

    exports.delete = function (sessionId) {
        delete store[sessionId];
    };
})();