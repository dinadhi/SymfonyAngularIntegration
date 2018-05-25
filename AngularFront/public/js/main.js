(function () {
    angular.module("shop", [
        'shop.core',
        //pages
        'shop.product'
    ]);
})();

(function () {
    angular.module("shop.core", [
        'shop.blocks',

        //libs
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'flow'
    ]);
})();

(function () {
    angular.module("shop.blocks", [
        "blocks.services",
        "blocks.constantsService",
        "blocks.router"
    ]);
})();

(function () {
    angular.module("shop.product", [
        'product.list',
        'product.components'
    ]);
})();

(function () {
    angular.module("blocks.constantsService", []);
})();

(function () {
    angular.module("blocks.router", ["ui.router"]);
})();

(function () {
    angular.module("blocks.services", [

    ]);
})();

(function () {
    angular.module("product.components", []);
})();

(function () {
    angular.module("product.list", []);
})();

(function(){
  'use strict';

  angular
    .module("shop")
    .config(config);

  config.$inject = [];

  function config(){}
})();

(function() {
    'use strict';

    angular
        .module("shop.core")
        .controller('CoreController', coreController);

    coreController.$inject = [];

    function coreController(){
        var vm = this;
    }
})();

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

(function(){
  angular
        .module('blocks.services')
        .factory('ProductService', productService);

        productService.$inject = ['$http', 'BASE_INFO'];

        function productService($http, BASE_INFO) {
          var services = {
            getList: getList,
            get: get,
            update: update,
            remove: remove
          };

          var apiURL = BASE_INFO.URL + BASE_INFO.PORT + BASE_INFO.API_URL;

          return services;

          /////////////////////

          function getList(pageNumber, pageSize) {
            return $http.get(apiURL + '/products?pageNumber='+pageNumber+'&pageSize='+pageSize);
          }
          
          function get(id) {
            return $http.get(apiURL + '/products/' + id)
          }

          function update(product) {
            return $http.put(apiURL + '/products', {
              "id": product.id,
              "title": product.title,
              "description": product.description,
              "name_image": product.imagename,
              "path": product.path
            });
          }

          function remove(id) {
            return $http.delete(apiURL + '/products/'+ id);
          }
        }
})();

(function () {
    'use strict';

    angular
        .module("product.list")
        .controller("CreateOrUpdateProductController", createOrUpdateProductController);

    createOrUpdateProductController.$inject = ["$uibModalInstance", "id", 
        "BASE_INFO", "ProductService"];

    function createOrUpdateProductController($uibModalInstance, id, 
                                             BASE_INFO, ProductService) {
        var vm = this;

        vm.productId = id;
        vm.product = {};
        vm.ok = ok;
        vm.cancel = cancel;
        vm.uploadSuccess = uploadSuccess;
        vm.uploadError = uploadError;
        vm.upload = {};

        if(id){
            getProduct();
        }

        var apiURL = BASE_INFO.URL + BASE_INFO.PORT + BASE_INFO.API_URL;
        vm.baseurl = BASE_INFO.URL + BASE_INFO.PORT;

        vm.config = {
            singleFile: true,
            target: apiURL + "/products",
            uploadMethod: 'PUT',
            query: function () {
                return {
                    id: vm.product.id,
                    title: vm.product.title,
                    description: vm.product.description
                };
            }
        };

        function getProduct() {
            ProductService
                .get(id)
                .then(function (response) {
                    vm.product = response.data;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function ok() {
            vm.upload.flow.opts.testChunks = false;
            //vm.upload.flow.opts.testMethod = 'OPTIONS';
            if(!vm.upload.flow.files.length){
                //update without image
                ProductService
                    .update(vm.product)
                    .then(function (response) {
                        response.data.isEdit = true;
                        return $uibModalInstance.close(response.data);
                    })
                    .catch(function (error) {
                        return alert(error.data);
                    });
                
            } else if(typeof vm.product.id !== "undefined" && vm.upload.flow.files.length ) {
                //update with image or only image
                vm.upload.flow.opts.uploadMethod = 'POST';
                vm.upload.flow.upload();
            } else {
                //create new product
                vm.upload.flow.opts.uploadMethod = 'POST';
                vm.upload.flow.upload();
            }
        }

        function uploadSuccess($file, $message, $flow) {
            var updateProduct = JSON.parse($message);
            if(vm.productId){
                updateProduct.isEdit = true;
                return $uibModalInstance.close(updateProduct);
            }
            return $uibModalInstance.close(updateProduct);
        }

        function uploadError($file, $message, $flow) {
            return alert($message);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();//http://localhost:8000/images/products/570d86fe2913e.1410279017_2135528667.jpg
(function() {

  'use strict';

  angular
      .module("product.list")
      .controller("ProductController", productController)
      .controller("ConfirmRemoveController", confirmRemoveController)
  
  productController.$inject = ["$uibModal", "ProductService",
    "$filter", "BASE_INFO"];
  confirmRemoveController.$inject = ["$uibModalInstance"];

  function productController($uibModal, ProductService, $filter,
                             BASE_INFO) {
    var vm = this;

    vm.apiURL = BASE_INFO.URL + BASE_INFO.PORT + BASE_INFO.API_URL;

    vm.products = {
      items: [],
      totalRows: 0,
      pageNumber: 1,
      pageSize: 3
    };

    vm.maxSize = 5;
    vm.openModalToCreateOrUpdate = openModalToCreateOrUpdate;
    //vm.create = create;
    vm.loadProducts = loadProducts;
    vm.remove = remove;
    vm.openModalToConfirmRemove = openModalToConfirmRemove;
    vm.pageChanged = pageChanged;
    
    vm.init = init;
    vm.init();

    ///////////////

    function init() {
      loadProducts();
    }

    function loadProducts() {
      ProductService
        .getList(vm.products.pageNumber, vm.products.pageSize)
        .then(function (response) {
          vm.products.items = JSON.parse(response.data.products);
          vm.products.totalRows = response.data.totalRows;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function openModalToCreateOrUpdate(id) {
      var options = {
        animation: true,
        templateUrl: 'app/pages/product/list/modalCreateOrUpdateProduct.tmpl.html',
        controller: 'CreateOrUpdateProductController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          id: function () {
            return (typeof id !== "undefined") ? angular.copy(id) : null
          }
        }
      };

      $uibModal
        .open(options)
        .result
          .then(function (product) {
            if(product.isEdit){
              var myProduct = $filter('filter')(vm.products.items, {id: product.id})[0];
              var index = vm.products.items.indexOf(myProduct);
              vm.products.items.splice(index, 1 , product);
            } else {
              if(vm.products.items.length<3){
                vm.products.items.splice(0, 0, product);
              } else {
                vm.products.items.splice(vm.products.items.length - 1, 1);
                vm.products.items.splice(0, 0, product);
              }
            }
          })
          .catch(function (cancel) {
            //ну нет так нет
          });
    }

    function openModalToConfirmRemove(id) {
      var options = {
        animation: true,
        templateUrl: 'modalConfirmRemove.html',
        controller: 'ConfirmRemoveController as vm'
      };

      var confirmRemoveModal = $uibModal.open(options);

      confirmRemoveModal.result
        .then(function (ok) {
          vm.remove(id);
        })
        .catch(function (cancel) {
          //передумал удалять
        });
    }

    function remove(id) {
      ProductService
        .remove(id)
        .then(function (response) {
          loadProducts();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    
    function pageChanged() {
      vm.loadProducts();
    }
  }

  function confirmRemoveController($uibModalInstance) {
    var vm = this;

    vm.ok = ok;
    vm.cancel = cancel;

    function ok() {
      $uibModalInstance.close('ok');
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
  
})();

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