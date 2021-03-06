(function () {
  "use strict";

  angular
  .module('app.rooms')
  .controller('RoomsCtrl', RoomsCtrl);

  RoomsCtrl.$inject = ['$scope', '$q', '$window', 'common', 'RoomListingView', 'currentUser', 'screenSize', 'ngDialog', '$cookieStore'];

  function RoomsCtrl($scope, $q, $window, common, RoomListingView, currentUser, screenSize, ngDialog, $cookieStore) {
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
      var localHousingData; //default. define local storage variable

      /*
       * Set initial fields for the search criteria. If there is data in the local cookie use that instead.
       * This means that a user has to press Reset on the front-end to default to the standard search
       */
      vm.setSearchFields = function () {
        var cookieVariable = $cookieStore.get('availableHousingSearchFields');
        if(cookieVariable) {
          vm.searchCriteria = cookieVariable;
        }
        else {
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
        }
      };

      //Initializes search fields
      vm.setSearchFields();

      /*
       * Removes cookie and calls setSearchField function to set the default values of search criteria.
       */
      vm.clearSearch = function(showSearch) {
        /*
         * Remove local storage data and cookie data
         */
        $cookieStore.remove('availableHousingSearchFields');
        sessionStorage.removeItem('availableHousing');
        vm.setSearchFields();
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

      /*
       * Function for searching if the search button is pressed on the front end.
       * Clear local storage before executing search function
       */
      vm.searchFromButton = function () {
        sessionStorage.removeItem('availableHousing');
        vm.search(false);
      };

      vm.search = function(showSearch) {

        /*
         * Check if there is local data already present. If no local data is present only then run a search query to the server
         */
        localHousingData = sessionStorage.getItem('availableHousing');

        if(localHousingData != null) {
          vm.availableRooms = JSON.parse(localHousingData);
          arrangeHousingInfo(vm.availableRooms);
          vm.groups = vm.availableRooms.inGroupsOf(8);
          vm.showSearch = showSearch;
          vm.showSort = showSearch;
        }
        else {
          if(vm.searchCriteria.within) {
            vm.searchCriteria.within.place = { type: 'univ', id: currentUniversityId };
          } else {
            vm.searchCriteria["within"]={
              place:{type: 'univ', id: currentUniversityId},
              distance:10
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
            vm.availableRooms = availRooms;
            arrangeHousingInfo(vm.availableRooms);
            vm.groups = vm.availableRooms.inGroupsOf(8);
            vm.showSearch = showSearch;
            vm.showSort = showSearch;
            $cookieStore.put('availableHousingSearchFields', vm.searchCriteria); // store search fields to the cookie
            sessionStorage.setItem('availableHousing', JSON.stringify(vm.availableRooms)); // store housing data locally
          });
        }

        orderSliderButtons();
      };
      vm.search(false);
      vm.clearSearchAndSearch = function(showSearch) {
        vm.clearSearch(false);
        vm.search(showSearch);
      };

      /*
       *  ngDialog
       */
      $scope.open = function (emailAddress, firstname, lastname) {
        ngDialog.open({
          template: 'aroundYouMessage',
          controller: 'ngDialogCtrl',
          data: {
            email: emailAddress,
            firstName: firstname,
            lastName: lastname}
        });
      };

    }

    /*
     * Parse the local data or data from server. Push to the buffer to display the ID of the rooms as well as the people to message
     */
    function arrangeHousingInfo(availableHousing) {
      vm.allIds = [];
      vm.allRoomCreators = [];
      var i = 0;
      angular.forEach(availableHousing, function (room) {
        vm.allIds.push(room.roomDetails.id);
        RoomListingView.get({id: room.roomDetails.id},function(room) {
          //on success callback function
          vm.availableRooms[i].relatedCreatorId = room.roomDetails.relatedCreatorId;
          i++;
        });
      });
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

    /*
     *  prerender.io
     */
    $scope.$parent.seo = {
      pageTitle: 'Campusly Housing',
      pageDescription: 'Search for off-campus housing - available rooms, apartments, or houses'
    };

  }


}());

