(function () {
    var fs = require('fs');
    require('date-utils');
    
    var logfile;

    exports.init = function (options) {
        if (logfile === undefined && options.filename !== undefined) {
            logfile = fs.openSync(options.filename, 'a');
        }
    };
    
    exports.plugin = function (error) {
        var timestamp = new Date().toCLFString(),
            entry     = timestamp + ': ' + error;

        if (logfile) {
            fs.write(logfile, entry);
        } else {
            console.log(entry);
        }
    };
})();