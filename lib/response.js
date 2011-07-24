(function () {
    var url  = require('url'),
        util = require('util'),
        ee   = require('eventemitter2').EventEmitter2;

    function Response (response, request, routes) {
        ee.call(this);

        this.length      = 0;

        this._content    = [ ];
        this._routes     = routes;
        this._actual     = { response: response, request: request };

        this._croute     = 0;
        this._cpos       = 0;
        this._headers    = { };
        this._code       = 200;
        this._ended      = false;

        var parsed       = url.parse(request.url, true);
        this._pathname   = parsed.pathname;
        this.socket      = response.socket;
    }

    util.inherits(Response, ee);
    
    Response.prototype.checkRoute = function (route, path) {
        if (typeof(route) === 'function') {
            try {
                var match = route(path);
                if (match) {
                    return true;
                }
            } catch (error) {
                this.emit('route.fatal', error);
            }
        } else if (typeof(route) === 'object') {
            throw new Exceptin("RegExp as function has been depricated as of Node.js 0.5");
        } else {
            if ((typeof(route) === 'string') && path.match(route)) {
                return true;
            }
        }
        
        return false;
    };
    
    Response.prototype.next = function () {
        if (this._croute >= this._routes.length) {
            // done running the routes
            return;
        }

        if (this._cpos >= this._routes[this._croute].length) {
            // done running the current route
            this.end();
            return;
        }

        var next = this._routes[this._croute][this._cpos];
        this._cpos++;
        
        var route = next.path;
        if (this.checkRoute(next.path, this._pathname)) {
            try {
                next.call(this._actual.request, this, next);
            } catch (error) {
                this.emit('run.fatal', error);
            }
        }

        this.next();
    };
    
    Response.prototype.end = function () {
        switch (this._croute) {
        case 0:
            this.emit('pre.complete', this);
            break;
        case 1:
            this.emit('main.complete', this);
            break;
        case 2:
            this.emit('post.complete', this);
            break;
        case 3:
            this.emit('final.complete', this);
            break;
        }

        this._croute++;
        this._cpos = 0;

        if (this._croute >= this._routes.length) {
            // done running the routes
            return;
        }
        
        if (this._croute === 2) {
            var length = 0;

            for (var i = 0; i < this._content.length; i++) {
                length += this._content[i].length;
            }

            this.length = length;
            this.setHeader('Content-Length', length);
            this._actual.response.writeHead(this._code, this._headers);

            for (i = 0; i < this._content.length; i++) {
                this._actual.response.write(this._content[i], 'binary');
            }

            this._actual.response.end();
            this._ended = true;
        }
        
        this.next();
    };
    
    Response.prototype.final = function () {
        if (this._croute < 2) {
            this._croute = 1;
            this.end();
        }
    };
    
    Response.prototype.setHeader = function (key, value) {
        this._headers[key] = value;
    };

    Response.prototype.getHeader = function (key) {
        return this._headers[key];
    };
    
    Response.prototype.write = function (data) {
        if (this._ended) {
            throw new Exception('Error: unable to write(), end() has been run');
        } else {
            this._content.push(data);
        }
    };
    
    Response.prototype.statusCode = function (code) {
        if (code !== undefined) {
            this._code = code;
        }
        return this._code;
    };
    

    exports.response = Response;
})();