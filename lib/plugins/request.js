(function () {
    var url = require('url'),
        qs  = require('querystring');

    exports.meta = {
        name:        'request handler',
        description: 'Naive request augmentation plugin'
    };
    
    exports.plugin = function (request, response, options) {
        var parsed = url.parse(request.url, true);
        
        request.query  = parsed.query;
        request.search = parsed.search;
        request.hash   = parsed.hash;

        request.param = function (key, value) {
            if (value !== undefined) {
                this.query[key] = value;
                
                return this;
            } else {
                return this.query[key];
            }
        };

        if (request.method == 'POST') {
            var body = '';

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                request.query = qs.parse(body);

                response.next();
            });
        } else {
            response.next();
        }
    };
})();