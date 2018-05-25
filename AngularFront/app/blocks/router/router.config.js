(function () {

    angular
        .module("blocks.router")
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "",
                templateUrl: "app/pages/home/home.html"
            })
            .state("about", {
                url: "/about",
                templateUrl: "app/pages/about/about.html"
            })
            .state("contact", {
                url: "/contact",
                templateUrl: "app/pages/contact/contact.html"
            })
            .state("products", {
                url: "/products",
                controller:"ProductController as vm",
                templateUrl:'app/pages/product/list/productList.html'
            });
    }
})();
