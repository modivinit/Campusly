(function () {
  "use strict";

  angular
    .module('app.core')
    .factory('Pet', Pet);

  Pet.$inject = ['$resource'];
  function Pet($resource) {
      return $resource('/api/users/:userId/pets/:id', {userId:'@userId', id: '@id'},
        {
          getAllPets: {
            method: 'GET',
            isArray:true,
            params: {
              id:'all'
            }
          },
          editPet: {
            method: 'PUT'
          }
        }
      );
    }


}());
