(function () {
  "use strict";

  angular.module('app.core')
    .factory('Vehicle', function ($resource) {
      return $resource('/api/users/:userId/vehicles/:id', {userId:'@userId', id: '@id'});
    });


}());
