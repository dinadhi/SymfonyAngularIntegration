(function () {
    'use strict';

    productShortController.$inject = ["ProductService", "BASE_INFO"];
    
    function productShortController(ProductService, BASE_INFO) {
        var vm = this;
        vm.apiUrl = BASE_INFO.URL + BASE_INFO.PORT;
    }

    var options = {
        restrict: "EA",
        bindings: {
            product: '<',
            openModalToCreateOrUpdateProduct: '&',
            openModalToConfirmRemoveProduct: '&'
        },
        templateUrl: 'app/pages/product/components/shortProduct/shortProduct.html',
        controller: productShortController,
        controllerAs: 'vm'
    };

    angular
        .module('product.components')
        .component('shortProduct', options);
})();