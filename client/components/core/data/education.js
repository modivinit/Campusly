(function () {
  "use strict";

  angular
    .module('app.core')
    .factory('Education', Education);

  Education.$inject = ['$resource'];
  function Education($resource) {
      return $resource('/api/users/:userId/educations/:id', {userId:'@userId', id: '@id'},
        {
          getAllEducations: {
            method: 'GET',
            //isArray:true,//for MVP
            params: {
              id:'all'
            }
        },
        editEducation: {
          method: 'PUT'
        }
        }
      );
    }


}());
