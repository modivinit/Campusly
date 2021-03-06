(function () {
  "use strict";

  angular
    .module('app.dashboard')
    .controller('EditRoomCtrl',EditRoomCtrl);

  EditRoomCtrl.$inject = ['$scope', '$state', '$stateParams', 'logger', 'FileUploader', 'common','RoomListing', 'data', 'currentUser'];

  function EditRoomCtrl($scope, $state, $stateParams, logger, FileUploader, common, RoomListing, data,  currentUser) {
    var vm = this;
    vm.propertyImages = [];
    vm.me = currentUser;
    vm.users = data[0];
    vm.roommates = data[1];
    vm.room = data[2];
    vm.ddlYesNoSelect = [{value: true, text: 'Yes'}, {value: false, text: 'No'}];
    vm.universitiesList = data[3];
    vm.education = data[4];
    vm.education.educationCenterName = vm.universitiesList[vm.education.universityId - 1];

    var roomId = $stateParams.id;

    if(vm.education.educationCenterName){
      var EducationStatus = vm.education.educationCenterName;
      var educationId = vm.education.id;
    }

    vm.edit = function (form, education) {
      vm.submitted = true;
      if(form.$valid) {
      vm.room.creatorId = vm.me.id;
      RoomListing.edit( { userId: vm.me.id, id: roomId}, {room: vm.room}).$promise.then(function () {
        var educationInput = {};
        educationInput.universityId = education.educationCenterName.id;
        educationInput.educationCenterName = education.educationCenterName.name;
        if(EducationStatus){
          if(EducationStatus.name != vm.education.educationCenterName.name) {
            common.dataservice.editEducation(vm.me.id, educationId, educationInput, function () {
              },
              function (err) {
                console.log('error while updating campus ', err);
              });
          }
        } else {
          common.dataservice.addEducation(vm.me.id, educationInput)
            .$promise
            .then(function () {
            })
            .catch(function (err) {
              console.log('error while adding campus ',err);
            })
        }
        common.logger.success('Room updated!');
        common.$state.go('roomDetail', { param: roomId, allIds:[roomId] },{reload: true});
      }).catch(function (err) {
        common.logger.error('error while updating room ',err)
      })
      } else {
        vm.errors = true;
      }
    };

    vm.deleteRoom = function () {
      var input = {activeRoom: false};
      RoomListing.edit( { userId: vm.me.id, id: roomId}, {room: input}).$promise.then(function () {
        common.logger.success('Room deleted.');
        $state.go('dashboard', {}, {reload: true});
      }, function (errors) {
        //TODO need a general error handling banner or scheme to broadcast a message on
      });
    };

    vm.uploader = new FileUploader();
    vm.uploader.url = '/api/images';
    vm.uploader.onSuccessItem = function (itm,res,status,header) {
      vm.me.profileImage =res.saved;
    };

    vm.data = {
      url:'/api/images',
      successCallback: successCallback,
      errorCallback: errorCallback
    };

    function successCallback(file, resp) {
      common.logger.success('Image '+file._file.name+' uploaded');
    }
    function errorCallback(file) {
      common.logger.error('Error while uploading '+file._file.name+' image');
    }

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

    mixpanel.track("edit your room");
    mixpanel.people.increment('edit a room');

  }
}());


