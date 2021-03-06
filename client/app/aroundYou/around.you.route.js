(function() {
  "use strict";

  angular
    .module('app.dashboard')
    .config(config);

  config.$inject=['$stateProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('aroundYou', {
        url: '/aroundYou',
        templateUrl: 'app/aroundYou/around.you.html',
        controller: 'aroundYouCtrl',
        controllerAs:'around',
        resolve:{
          currentUser : getCurrentUser
          //,data : getData
        },
        authenticate: true,
        cache:false
      });
  }

  getCurrentUser.$inject = ['common', '$q'];
  function getCurrentUser(common, $q) {
    var deferred = $q.defer();
    common.Auth.getCurrentUser(function(user) {
      deferred.resolve(user);
    });
    return deferred.promise;
  }

}());
