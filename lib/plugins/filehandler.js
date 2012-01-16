(function() {
    var fs   = require('fs'),
        path = require('path'),
        url  = require('url'),
        mime = require('mime');

    var Cromag = require('cromag');

    var base;

    exports.meta = {
        name:        'default file handler',
        description: 'Basic file handler plugin'
    };

    exports.init = function(options) {
        options = options || {};
        base    = options.basedir || '.';
    };

    exports.plugin = function(request, response, options) {
        var parsed = url.parse(request.url, true);
        var pathname = path.normalize(parsed.pathname);

        var file = base + '/' + pathname;
        fs.stat(file,
            function(err, stats) {
                if (err !== null) {
                    response.next();
                } else {
                    if (request.headers['if-modified-since']) {
                        var modified = Cromag.parse(request.headers['if-modified-since']);

                        if (modified && modified <= stats.mtime.valueOf()) {
                            response.statusCode(304);
                            response.end();

                            return;
                        }
                    }

                    fs.readFile(file, "binary",
                        function(err, data) {
                            if (err !== null) {
                                response.next();
                            } else {
                                response.setHeader('Content-Type', mime.lookup(file));
                                response.setHeader('Date', new Cromag().toUTCString());

                                response.setHeader('Last-Modified', stats.mtime.toUTCString());
                                response.setHeader('Age', parseInt((new Cromag().valueOf() - stats.mtime.valueOf()) / 1000));

                                if (options.timeout) {
                                    response.setHeader('Cache-Control', 'max-age=' + options.timeout + ', public');
                                    response.setHeader('Expires', stats.mtime.clone().add({ seconds: options.timeout }).toUTCString());
                                }

                                response.write(data);

                                response.end();
                            }
                        }
                    );
                }
            }
        );
    };
})();
