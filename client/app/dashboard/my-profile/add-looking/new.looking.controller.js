(function () {
  "use strict";

  angular
    .module('app.dashboard')
    .controller('NewLookingCtrl', NewLookingCtrl);

  NewLookingCtrl.$inject = ['$scope', 'common', 'currentUser', 'data'];

  function NewLookingCtrl($scope, common, currentUser, data) {
    var vm = this;
    vm.education = data[0];
    vm.universitiesList = data[1];
    vm.me = currentUser;
    vm.errors = false;

    $scope.datePickers = {
      startDate: false,
      endDate:false
    };
    vm.address = {};
    $scope.format = 'MM/dd/yyyy';
    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.open = function($event, number) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.datePickers[number]= true;
    };

    vm.addLooking = function (input, form, education) {
      vm.submitted = true;
      if (form.$valid) {
      common.dataservice.addLooking(vm.me.id, input)
        .$promise
        .then(function (looking) {
          var educationInput = {};
          educationInput.universityId = education.educationCenterName.id;
          educationInput.educationCenterName = education.educationCenterName.name;
          common.dataservice.addEducation(vm.me.id, educationInput)
            .$promise
            .then(function () {
              common.logger.success('Looking successfully added.');
              common.$state.go('lookingDetail', {id: looking.id}, {reload: true});
                })
            .catch(function (err) {
              common.logger.error('Error while saving education.',err);
            });
        })
        .catch(function (err) {
          common.logger.error('Error while saving looking.');
        });
      } else {
        vm.errors = true;
      }
    };

    mixpanel.track('add a looking');

  }

}());
