(function() {

  "use strict";

  angular
    .module('app.messages')
    .controller('MessageCtrl', MessageCtrl);

  MessageCtrl.$inject = ['common', '$scope', 'currentUser', 'UserResource', '$q', 'pubNubService'];

  function MessageCtrl(common, $scope, currentUser, UserResource, $q, pubNubService) {

    //Set the variables to current user, and retrieve information from DB about their education
    var vm = this;
    var debug = false;
    vm.me = currentUser;
    vm.education = common.dataservice.getAllEducations(currentUser.id);

    /*
     * Collect all the promises in an array and load the initialize function only if the promises are met
     */
    var promises = [vm.education.$promise];

    $q.all(promises).then(function () {
      /*
       * Only initialize the PubNub message controller if the university is set.
       * If user has no university then they are prompted to update university before initializing
       */
      if (vm.education.universityId){
        initializeMessageController();
      }

    });

    function initializeMessageController() {

      vm.pubNubService = pubNubService;



      /* HTML and CSS: For the list of private messages, when someone clicks on one of the boxes,
       it should call vm.privateCurrentSubscribe
       */

      vm.oldestInboxTimeToken = null;
      vm.oldestChatTimeToken = null;





      pubNubService.clearNotifs();

      //sned time token
      pubNubService.sendCurrentTimeToken();

      pubNubService.notAppCheckUnreadMessage(true);

      //tell the service we are in messages
      pubNubService.setInMessages(1);


      if(debug) {
        console.log('Below is pubNubService');
        console.log(pubNubService);
      }

    }

    mixpanel.track("messages view");
    mixpanel.people.increment('messages view');

    vm.trackMixpanelMessageSent = function () {
      mixpanel.track("Message sent");
    };

    /*
     *  prerender.io
     */
    $scope.$parent.seo = {
      pageTitle: 'Campusly Messages',
      pageDescription: 'Your personal dashboard'
    };

  }

}());
