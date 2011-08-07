(function () {
    var url    = require('url');
    var http   = require('http');

    var worker = require('./response');

    // default plugins
    var filehandler  = require('./plugins/filehandler');
    var fourohfour   = require('./plugins/404handler');
    var loghandler   = require('./plugins/clfloghandler');
    var redirect     = require('./plugins/redirecthandler');
    var session      = require('./plugins/sessionhandler');
    var errorhandler = require('./plugins/errorhandler');

    function AppServer (options) {
        this.options = options || { };

        this.pre    = [ ];
        this.post   = [ ];
        this.main   = [ ];
        this.final  = [ ];
        
        this.server = undefined;

        this.eventHandlers = [ ];
        
        this.plugins = {
            "filehandler":    filehandler,
            "fourohfour":     fourohfour,
            "loghandler":     loghandler,
            "redirect":       redirect,
            "sessionhandler": session,
            "errorhandler":   errorhandler
        };
    }



    AppServer.prototype.addRoute = function (path, call, options) {
        options = options || { };
        
        if (options.section === undefined) {
            options.section = 'main';
        }

        options.path = path;

        if (typeof(call) === 'function') {
            options.call = call;
        } else {
            if (call.init !== undefined) {
                call.init(options);
            }
            if (call.plugin !== undefined) {
                options.call = call.plugin;
            }
        }

        switch (options.section) {
        case 'pre':
            this.pre.push(options);
            break;
 
        case 'post':
            this.post.push(options);
            break;
 
        case 'final':
            this.final.push(options);
            break;
 
        default:
            this.main.push(options);
        }

        return this;
    };

    AppServer.prototype.createServer = function (server) {
        var thisp = this;

        server = server || http;
        this.server = server.createServer(function (request, response) {
            thisp.handleRequest(request, response, thisp);
        });

        return this.server;
    };

    AppServer.prototype.handleRequest = function (request, response, thisp) {
        var res = new worker.response(response, request, thisp.getRoutes());
        
        if (typeof(this.options.checkRoute) === 'function') {
            res.checkRoute = this.options.checkRoute;
        }
        
        for (var i = 0; i < this.eventHandlers.length; i++) {
            res.on(this.eventHandlers[i].event, this.eventHandlers[i].handler);
        }

        res.next();
    };

    AppServer.prototype.getRoutes = function () {
        return [ this.pre, this.main, this.post, this.final ];
    };

    AppServer.prototype.addEventHandler = function (event, handler) {
        this.eventHandlers.push({ event: event, handler: handler });
    };

    exports.appserver = AppServer;
})();
