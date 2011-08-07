(function () {
    var fs   = require('fs'),
        path = require('path'),
        url  = require('url'),
        mime = require('mime');

    var base;
    
    exports.init = function (options) {
        options = options || { };
        
        base = options.basedir || '.';
        
    };
    
    exports.plugin = function (request, response, options) {
        var parsed   = url.parse(request.url, true);
        var pathname = path.normalize(parsed.pathname);

        var file = base + '/' + pathname;
        fs.stat(file, function (err, stats) {
            if (err !== null) {
                response.next();
            } else {
                fs.readFile(file, "binary", function (err, data) {
                    if (err !== null) {
                        response.next();
                    } else {
                        response.setHeader('ContentType', mime.lookup(file));
                        response.write(data);

                        response.end();
                    }
                });
            }
        });
    };
})();