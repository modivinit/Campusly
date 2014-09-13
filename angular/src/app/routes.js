"use strict";

angular.module('myApp.routes', ['ngRoute'])

    // configure views; the authRequired parameter is used for specifying pages
    // which should only be available while logged in
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider.when('/', {
            templateUrl: 'partials/home.tpl.html',
            controller: 'HomeCtrl',
            profileRequired: function (profile)
            {
                console.log('home', profile.type);

                if (!profile) return;

                if (profile.type=='owner')
                  return '/owners';  
                else
                if (profile.type=='tenant')
                  return '/tenants';
                else
                if (profile.type=='admin')
                  return '/admin/credit-check';
            }
        });

        $routeProvider.when('/terms', {
            templateUrl: 'partials/terms.tpl.html',
            controller: 'StaticCtrl'
        });

        $routeProvider.when('/privacy-policy', {
            templateUrl: 'partials/privacy.tpl.html',
            controller: 'StaticCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/'});
        
        $locationProvider.html5Mode(true);
        
    }]);
