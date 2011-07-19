(function () {
    var url    = require('url');
    var http   = require('http');

    var worker = require('./response');

    // default plugins
    var filehandler = require('./plugins/filehandler');
    var fourohfour  = require('./plugins/404handler');
    var loghandler  = require('./plugins/clfloghandler');
    var redirect    = require('./plugins/redirecthandler');


    function AppServer () {
        this.pre    = [ ];
        this.post   = [ ];
        this.routes = [ ];
        this.final  = [ ];
        
        this.server = undefined;
        
        this.plugins = {
            "filehandler": filehandler,
            "fourohfour":  fourohfour,
            "loghandler":  loghandler,
            "redirect":    redirect
        };
    }



    AppServer.prototype.addRoute = function (path, call, options) {
        options = options || { };
        
        if (options.section === undefined) {
            options.section = 'routes';
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
            this.routes.push(options);
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
        res = new worker.response(response, request, thisp.getRoutes());
        res.next();
    };

    AppServer.prototype.getRoutes = function () {
        return [ this.pre, this.routes, this.post, this.final ];
    };


    exports.appserver = AppServer;
})();
