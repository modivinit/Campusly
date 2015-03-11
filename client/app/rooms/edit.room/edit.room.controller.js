(function () {
  "use strict";

  angular
    .module('app.dashboard')
    .controller('EditRoomCtrl',EditRoomCtrl);

  EditRoomCtrl.$inject = ['$scope', '$state', '$stateParams', 'logger', 'FileUploader', 'common','RoomListing'];

  function EditRoomCtrl($scope, $state, $stateParams, logger, FileUploader, common, RoomListing) {

    /* jshint validthis: true */
    var vm = this;
    vm.propertyImages = [];

    vm.me = common.Auth.getCurrentUser();

    var roomId = $stateParams.id;
    logger.log('Room id: ', roomId);

    if(!roomId) {
      //TODO show error and/or  return to dashboard
    }
    else {
      RoomListing.get({userId: vm.me.id, id: roomId}).$promise.then(function (roomListing) {
        vm.room = roomListing;

        //console.log( angular.isDate(vm.room.availableMoveIn) );
        //console.log( angular.isString(vm.room.availableMoveIn) );
        //console.log(  vm.room.availableMoveIn.split('T', 1) );
        vm.room.availableMoveIn =  vm.room.availableMoveIn.split('T', 1)[0];
        vm.room.leaseEndDate =  vm.room.leaseEndDate.split('T', 1)[0];

        console.log('Room to edit: ', roomListing);
      }, function (errors) {

        //TODO need a general error handling banner or scheme to broadcast a message on
        console.log('error(s) while saving room listing', errors);
      });
    }



    vm.edit = function () {

      //console.log('Room from ctrl: ', vm.room);


      //   if(vm.room.$valid) {
      vm.room.creatorId = vm.me.id;

      RoomListing.edit( { userId: vm.me.id, id: roomId}, {room: vm.room}).$promise.then(function () {

        $state.go('dashboard');
      }, function (errors) {

        //TODO need a general error handling banner or scheme to broadcast a message on
        console.log('error(s) while saving room listing', errors);
      });
      //  }
    };

    vm.delete = function () {
      RoomListing.delete( { userId: vm.me.id, id: roomId}).$promise.then(function () {

        $state.go('dashboard');
      }, function (errors) {

        //TODO need a general error handling banner or scheme to broadcast a message on
        console.log('error(s) while saving room listing', errors);
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
      console.log(file);
      common.logger.success('Image '+file._file.name+' uploaded');
    }

    function errorCallback(file) {
      common.logger.error('Error while uploading '+file._file.name+' image');
    }
  }
}());


