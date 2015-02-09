(function () {
  "use strict";

  angular
      .module('app.account')
      .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject=['$scope', 'Auth', '$state', '$window','FileUploader'];

  function SignupCtrl($scope, Auth, $state, $window, FileUploader) {
    var vm = this;
    vm.user = {};
    vm.errors = {};

    $scope.$parent.seo = {
      pageTitle:'Please sign in',
      pageDescription:'place for signing in'
    };
    mixpanel.track("visited signup view new");

    vm.uploader = new FileUploader();
    vm.uploader.url = '/api/images';
    vm.uploader.onSuccessItem = function (itm,res,status,header) {
     vm.user.picUrl = res.saved;
    };

    vm.register = function (form) {
      vm.submitted = true;
      if (form.$valid) {
        Auth.createUser({
          firstname: vm.user.firstname,
          lastname: vm.user.lastname,
          middlename: vm.user.middlename,
          username: vm.user.username,
          email: vm.user.email,
          password: vm.user.password
        })
          .then(function () {
            // Account created, redirect to home
            $state.go('main');
          })
          .catch(function (err) {
            err = err.data;
            vm.errors = {};
          // Update validity of form fields that match the sequelize errors
          if (err.name) {
            angular.forEach(err.fields, function (field) {
              form[field].$setValidity('mongoose', false);
              vm.errors[field] = err.message;
            });
          }
          });
        }
    };

    vm.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };
  }

}());


