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