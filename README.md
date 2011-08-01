# Bricks.js

An advanced modular Web Framework built on Node.

## Installing

    $ npm install bricks

## Super Basic Usage

Change directories into the directory that you wish to server files from:

    $ bricks

Usage:

    Usage: bricks [--help] [--port port] [--ipaddr ipaddr] [--path path] [--log log]
        --port port     [default 8080]
        --ipaddr ipaddr [default 0.0.0.0]
        --path path     [default "."]
        --log log       [default none]
    

## Basic Usage

    var bricks = require('bricks');
    var appServer = new bricks.appserver();
    
    appServer.addRoute("/static/.+", appServer.plugins.filehandler, { basedir: "./static" });
    appServer.addRoute(".+", appServer.plugins.fourohfour);
    var server appServer.createServer();
    
    server.listen(3000);

### Routes

Routing in `bricks` is based on `String` matches and truth values.  A `regular expression` may be passed, as well as a `function` that can determine whether or not the route should be executed.

The `router` simplified:

    if (typeof(route) === 'function') {
        var match = route(path);
        if (match) {
            return true;
        }
    } else {
        if ((typeof(route) === 'string') && path.match(route)) {
            return true;
        }
    }
    
    return false;

## Built-in Plugins

There are plugins that are built-in to `bricks` that cover basic usage.  These plugins are light-weight and loaded as part of the application server.  These plugins accept various options for configuration.

### plugins.filehandler

Default static file handler.  This file handler is for basic functionality, it does not cache.

    {
      basedir: '/path/to/files/'  // default '.'
    }

### plugins.fourohfour

Default 404 handler.  By design, this handler simply sets the 404 status code and writes `404 Error` to the requesting browser.

### plugins.redirect

The default redirect handler deals with both temporary and permanent redirects.  As with `routes`, the path can be a `String`, a `RegExp`, or a `function`.  Redirects are sent as `temporary` redirects (307) unless denoted as `permanent` (301).

    {
      routes: [
        { path: "^/foo$", url: "http://foo.com/foo", permanent: true },
        { path: new RegExp(/\/bar\/.+/), url: "http://bar.com/bar" }
      ]
    }


## Advanced Stuff

`Bricks` is a fully baked web application server, but a README can only contain so much information.

For more information and documentation visit [bricksjs.com](http://bricksjs.com/).