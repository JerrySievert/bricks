(function () {
    exports.plugin = function (request, response, options) {
        response.statusCode(404);
        response.write('404 Error');
        response.end();
    };
    
    exports.name = 'default 404 handler';
})();