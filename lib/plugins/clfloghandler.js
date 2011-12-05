(function () {
    var fs = require('fs');
    require('date-utils');
    
    var logfile;

    exports.init = function (options) {
        if (logfile === undefined && options.filename !== undefined) {
            logfile = fs.openSync(options.filename, 'a');
        }
    };
    
    exports.plugin = function (request, response, options) {
        if (logfile) {
            var now = new Date();
            var timestamp = now.toCLFString();
            var referer = request.headers.referer ? request.headers.referer : "-";

            var entry = request.connection.remoteAddress + " - - [" + timestamp + "] \"" +
                        request.url + "\" " + response.statusCode() + " " + response.length + " \"" +
                        referer + "\" \"" + request.headers['user-agent'] + "\"\n";

            fs.write(logfile, entry);
        }

        response.next();
    };
    
    exports.meta = {
        name:        'logger',
        description: 'Default CLF logger plugin'
    };
})();