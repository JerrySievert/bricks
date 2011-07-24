(function () {
    function Response (setup) {
        setup = setup || { };
        this._internals = setup;
        this.socket = {
            encrypted: setup.encrypted || false
        };
    }
    
    Response.prototype.get = function (key) {
        return this._internals[key];
    };
    
    Response.prototype.writeHead = function () {
        var code    = 200,
            reason  = 'OK',
            headers = { };
        
        if (arguments.length === 1) {
            code = arguments[0];
        } else if (arguments.length === 2) {
            code    = arguments[0];
            headers = arguments[1];
        } else if (arguments.length === 3) {
            code    = arguments[0];
            reason  = arguments[1];
            headers = arguments[2];
        }
        
        this._internals.code    = code;
        this._internals.reason  = reason;
        this._internals.headers = headers;
    };

    Response.prototype.setHeader = function (key, value) {
        this._internals.headers[key] = value;
    };

    Response.prototype.getHeader = function (key) {
        return this._internals.headers[key];
    };

    Response.prototype.end = function (data, encoding) {
        this._internals.data     = data;
        this._internals.encoding = encoding;
    };
    
    Response.prototype.write = function (data) {
        this._internals.buffer = data;
    };
    
    exports.response = Response;
})();