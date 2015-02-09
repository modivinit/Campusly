(function () {
  "use strict";

  angular
    .module('app.account')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', 'Auth', '$state', '$window'];

  function LoginCtrl($scope, Auth, $state, $window) {
      $scope.user = {};
      $scope.errors = {};

    $scope.$parent.seo = {
      pageTitle:'Please log in',
      pageDescription:'place for logging in'
    };
    mixpanel.track("visited login view new");

      $scope.login = function(form) {
        $scope.submitted = true;

        if (form.$valid) {
          Auth.login({
            email: $scope.user.email,
            password: $scope.user.password
          })
            .then(function() {
              // Logged in, redirect to home
              $state.go('main');
            })
            .catch(function(err) {
              $scope.errors.other = err.message;
            });
        }
      };

      $scope.loginOauth = function(provider) {
        console.log(provider);
        $window.location.href = '/auth/' + provider;
      };
    }


}());

