(function () {
  "use strict";

  angular.module('app.core')
    .factory('Address', function ($resource) {
      return $resource('/api/users/:userId/addresses/:id', {userId: '@userId', id: '@id'},
        {
          getAllAddresses: {
            method: 'GET',
            isArray:true,
            params: {
              id:'all'
            }
          },
          editAddress: {
            method: 'PUT'
          }
        }
      );
    })

}());
