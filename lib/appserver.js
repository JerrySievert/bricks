(function () {
    var url    = require('url');
    var http   = require('http');
    var uuid   = require('node-uuid');
    var worker = require('./response');

    // default plugins
    var filehandler  = require('./plugins/filehandler');
    var fourohfour   = require('./plugins/404handler');
    var loghandler   = require('./plugins/clfloghandler');
    var redirect     = require('./plugins/redirecthandler');
    var session      = require('./plugins/sessionhandler');
    var errorhandler = require('./plugins/errorhandler');
    var reqhandler   = require('./plugins/request');

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
            "errorhandler":   errorhandler,
            "request":        reqhandler
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
            if (call.name !== undefined) {
                console.warn('plugin.name has been deprecated in favor of plugin.meta.name');
                
                options.routeName = (call.meta && call.meta.name ? call.meta.name : call.name);
            } else if (call.meta && call.meta.name) {
                options.routeName = call.meta.name;
            }

            options.meta = call.meta;

            if (call.init !== undefined) {
                options.appServer = this;
                call.init(options);
            }

            if (call.plugin !== undefined) {
                options.call = call.plugin;
            }
        }

        options._id = uuid();

        switch (options.section) {
        case 'pre':
            if (options.top === true) {
                this.pre.unshift(options);
            } else {
                this.pre.push(options);
            }
            break;
 
        case 'post':
            if (options.top === true) {
                this.post.unshift(options);
            } else {
                this.post.push(options);
            }
            break;
 
        case 'final':
            if (options.top === true) {
                this.final.unshift(options);
            } else {
                this.final.push(options);
            }
            break;
 
        default:
            if (options.top === true) {
                this.main.unshift(options);
            } else {
                this.main.push(options);
            }
        }

        return {
            id:      options._id,
            section: options.section
        };
    };

    AppServer.prototype.removeRoute = function (routeId) {
        if (routeId === undefined || routeId.section === undefined || routeId.id === undefined) {
            return false;
        }

        var findAndRemove = function (array, id) {
            for (var i = 0; i < array.length; i++) {

                if (array[i]._id === id) {
                    return array.slice(0, i + 1).concat(array.slice(i + 2));
                }
            }

            return false;
        };

        var section;

        if (routeId.section === 'pre') {
            section = findAndRemove(this.pre, routeId.id);
            if (section !== false) {
                this.pre = section;
                return true;
            }
        } else if (routeId.section === 'main') {
            section = findAndRemove(this.main, routeId.id);
            if (section !== false) {
                this.main = section;
                return true;
            }
        } else if (routeId.section === 'post') {
            section = findAndRemove(this.post, routeId.id);
            if (section !== false) {
                this.post = section;
                return true;
            }
        } else if (routeId.section === 'final') {
            section = findAndRemove(this.final, routeId.id);
            if (section !== false) {
                this.final = section;
                return true;
            }
        }

        return false;
    };

    AppServer.prototype.createServer = function (server, options) {
        var thisp = this;

        server = server || http;

        var handler = function (request, response) {
            thisp.handleRequest(request, response, thisp);
        };

        if (options === undefined) {
            this.server = server.createServer(handler);
        } else {
            this.server = server.createServer(options, handler);
        }

        return this.server;
    };

    AppServer.prototype.handleRequest = function (request, response, thisp) {
        var res = new worker.response(response, request, thisp.getRoutes());
        
        if (typeof(this.options.checkRoute) === 'function') {
            res.checkRoute = this.options.checkRoute;
        }

        if (typeof(this.options.callRoute) === 'function') {
            res.callRoute = this.options.callRoute;
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
