(function () {
    angular.module("blocks.constantsService")
        .constant('BASE_INFO', {
            URL: 'http://localhost',
            PORT: ':8000',
            API_URL: '/api'
        })
        .constant('ERROR_CODES', {
            notFound: "not_found",
            unknown: "unknown_error"
        });
})();
