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
