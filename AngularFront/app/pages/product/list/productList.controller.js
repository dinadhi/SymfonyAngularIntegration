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
