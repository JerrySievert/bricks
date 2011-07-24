# Bricks.js

An advanced Web Framework built on Node.


## Super Basic Usage

Simply change directories into the directory that you wish to server files from:

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
    
    appServer.addRoute(/.+/, appServer.plugins.filehandler);
    
    var server appServer.createServer();
    
    server.listen(3000);


