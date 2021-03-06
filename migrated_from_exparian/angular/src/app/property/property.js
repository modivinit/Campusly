'use strict';

/* Controllers */
angular.module('myApp.property', ['ngRoute'])

// configure views; the authRequired parameter is used for specifying pages
// which should only be available while logged in
.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/property/:id', {
            templateUrl: 'property/details.tpl.html',
            controller: 'PropertyDetailsCtrl'
        });

        $routeProvider.when('/tour', {
            templateUrl: 'property/list.tpl.html',
            controller: 'PropertyListCtrl'
        });
        
        $routeProvider.when('/tour/howtoapply', {
            templateUrl: 'property/partials/howtoapply.tpl.html',
        });
        
        $routeProvider.when('/tour/howtoaddproperty', {
            templateUrl: 'property/partials/howtoaddproperty.tpl.html',
        });

    }
])

.controller('PropertyListCtrl', ['$scope', 'propertyService',
    function($scope, propertyService, $filter) {

        propertyService.featured()
        .$inst().$ref().on('value',function (data)
        { 
            $scope.properties= _.map(data.val(),function ($id) { return { $id: $id }; });
        });
        
        $scope.rentedIntro = 'wT2X5P00yio';

    }
])

.controller('PropertyDetailsCtrl', ['$scope', '$rootScope', '$routeParams', 'propertyService', '$filter', '$timeout', '$interval', '$location', '$modal',
    function($scope, $rootScope, $routeParams, propertyService, $filter, $timeout, $interval, $location, $modal) {

        var countdownTimer;

        $scope.property= propertyService.fetchWithBids($routeParams.id);

        $scope.property.$loaded(_.debounce(function ()
        {
            angular.element('.flexslider').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });

            $scope.bid= 'property/partials/bid.tpl.html';
            $scope.$apply();
        },1));

    }
]);
