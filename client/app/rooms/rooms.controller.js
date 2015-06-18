(function () {
  "use strict";

  angular
  .module('app.rooms')
  .controller('RoomsCtrl', RoomsCtrl);

  RoomsCtrl.$inject = ['$scope', '$q', '$window', 'common', 'RoomListingView', 'currentUser', 'screenSize'];

  function RoomsCtrl($scope, $q, $window, common, RoomListingView, currentUser, screenSize) {
    var vm = this;
    vm.property = {};
    vm.me = currentUser;
    vm.education = common.dataservice.getAllEducations(currentUser.id);
    var promises = [vm.education.$promise];
    $q.all(promises).then(function () {
      initializeRoomsController()
    });

    function initializeRoomsController(){
      vm.initialized = true;
      var currentUniversityId = vm.education.universityId;
      vm.sortOrder = 'descending';  // default
      vm.sortBy = 'createdAt';  // default
      vm.showSearch = false; // default
      vm.showSort = false; // default
      vm.clearSearch = function(showSearch) {
        vm.searchCriteria = {
          maxMonthlyPrice: null,
          leaseType: null,
          maxCurrentRoomates: null,
          propertyType: null,
          sharedBathroom: null,
          roomType : null,
          furnished: null,
          smokingAllowed: null,
          gender: null,
          petsAllowed: null,
          parkingAvailable: null,
          within: null
        };
      };

      $scope.datePickers = {
        startDate: false,
        endDate:false
      };
      $scope.format = 'MM/dd/yyyy';
      $scope.clear = function () {
        $scope.dt = null;
      };

      $scope.open = function($event, number) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePickers[number]= true;
      };

      vm.clearSearch(false);

      vm.search = function(showSearch) {
        if(vm.searchCriteria.within) {
          vm.searchCriteria.within.place = { type: 'univ', id: currentUniversityId };
        } else {
          vm.searchCriteria["within"]={
            place:{type: 'univ', id: currentUniversityId},
            distance:50
          }
        }

        var roomLimit;
        if (screenSize.is('xs')){
          roomLimit = 32;
        }
        else {
          roomLimit = 64;
        }

        RoomListingView.query({sortBy: vm.sortBy, sortOrder: vm.sortOrder, search: vm.searchCriteria, univId: currentUniversityId, limit: roomLimit}, function(availRooms) {
          vm.allIds = [];
          vm.availableRooms = availRooms;
          angular.forEach(vm.availableRooms, function (room) {
            vm.allIds.push(room.roomDetails.id)
          });
          vm.groups = vm.availableRooms.inGroupsOf(8);
          vm.showSearch = showSearch;
          vm.showSort = showSearch;
        });
        orderSliderButtons();
      };
      vm.search(false);
      vm.clearSearchAndSearch = function(showSearch) {
        vm.clearSearch(false);
        vm.search(showSearch);
      };
    }

    function orderSliderButtons() {
      setTimeout(function() {
        $(".slider").each(function(index) {
          var slider = $(".slider").eq(index);
          var dotsX = parseInt(slider.find(".slick-dots").css("left"));
          var dotsSize = parseInt(slider.find(".slick-dots").css("width"));
          var nextBtnX = dotsX + dotsSize + 10;

          slider.find(".slick-next").css("left", nextBtnX);
        });
      }, 1000);
    }

    angular.element($window).bind('resize', function () {
      orderSliderButtons();
    });

    angular.element(document).ready(function () {
      orderSliderButtons();
    });


    mixpanel.track("room grid view");
    mixpanel.people.increment('room grid view');

  }


}());

