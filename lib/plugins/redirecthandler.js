(function () {
    var url = require('url');
    
    var routes;
    
    exports.meta = {
        name:        'redirect handler',
        description: 'Default redirect plugin'
    };

    exports.init = function (options) {
        routes = options.routes;
    };
    
    exports.plugin = function (request, response, options) {
        var parsed = url.parse(request.url, true);
        
        for (var i = 0; i < routes.length; i++) {
            if (response.defaultCheckRoute(routes[i].path, parsed.pathname)) {
                if (routes[i].permanent) {
                    response.statusCode(301);
                } else {
                    response.statusCode(307);
                }

                response.setHeader('Location', routes[i].url);
                response.final();
                return;
            }
        }
        
        response.next();
    };
})();