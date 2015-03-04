(function () {

  "use strict";

  angular
    .module('app.dashboard', [])
    .config(function($stateProvider) {
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardCtrl',
          controllerAs:'dashboard',
          authenticate: true,
          resolve:{
            getUserLookings:getUserLookings,
            allLooking:allLooking
          }
        });
    });

  function getUserLookings(common,$q) {
    var deffered = $q.defer();
    var dataservice = common.dataservice;
    var me = common.Auth.getCurrentUser();
    deffered.resolve(dataservice.getAllLookings(me));
    return deffered.promise;
  }

  function allLooking(common, $q) {
    var deffered = $q.defer();
    deffered.resolve(common.$http({method:'get', url:'/api/lookings/all'}).success(function () {
    }));
    return deffered.promise;
  }


}());
