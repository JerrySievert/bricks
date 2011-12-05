(function () {
    exports.plugin = function (request, response, options) {
        options = options || { };
        options.statusCode = options.statusCode || 404;
        
        response.statusCode(options.statusCode);
        
        if (options.html !== undefined) {
            response.write(options.html);
        } else {
            response.write('404 Error');
        }

        if (options.callback !== undefined && typeof (options.callback) === 'function') {
            options.callback(request);
        }

        response.end();
    };
    
    exports.meta = {
        name: '404 handler',
        description: 'Default 404 plugin'
    };
})();