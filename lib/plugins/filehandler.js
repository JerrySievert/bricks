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

        try {
            var file = base + '/' + pathname;
            var stats = fs.statSync(file);

            if (stats) {
                var data = fs.readFileSync(file, "binary");

                if (data) {
                    response.setHeader('ContentType', mime.lookup(file));
                    response.write(data);
             
                    response.end();
                }
            }
        } catch (error) {
            response.next();
        }
    };
})();