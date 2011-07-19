(function () {
    function Request (setup) {
        setup = setup || { };
        this._internals = setup;
    }
    
    Request.prototype.set = function (key, value) {
        this._internals[key] = value;
    };

    Request.prototype.headers = function () {
        return this._internals.headers;
    };
    
    Request.prototype.method = function () {
        return this._internals.method;
    };
    
    exports.request = Request;
})();