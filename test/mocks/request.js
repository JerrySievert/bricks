(function () {
    function Request (setup) {
        var self = this;
        setup = setup || { };
        this._internals = setup;
        this.headers = { };
    }
    
    Request.prototype.set = function (key, value) {
        this._internals[key] = value;
    };

    Request.prototype.method = function () {
        return this._internals.method;
    };
    
    exports.request = Request;
})();