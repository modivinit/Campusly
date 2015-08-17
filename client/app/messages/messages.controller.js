(function() {

  "use strict";

  angular
    .module('app.messages')
    .controller('MessageCtrl', MessageCtrl);

  MessageCtrl.$inject = ['common', '$scope', 'currentUser', 'UserResource', '$q', 'PubNub'];

  function MessageCtrl(common, $scope, currentUser, UserResource, $q, PubNub) {

    //Set the variables to current user, and retrieve information from DB about their education
    var vm = this;
    vm.me = currentUser;
    vm.education = common.dataservice.getAllEducations(currentUser.id);

    /*
     * Collect all the promises in an array and load the initialize function only if the promises are met
     */
    var promises = [vm.education.$promise];
    $q.all(promises).then(function () {
      initializeMessageController()
    });

    function initializeMessageController() {


      /* HTML and CSS: For the list of private messages, when someone clicks on one of the boxes,
       it should call vm.privateCurrentSubscribe
       */

      const timeConvert = 10000;

      var email = JSON.stringify(vm.me.email);
      vm.newMessage = '';
      vm.currentChannel = {'name': '', 'secondaryChannel': null };

      vm.oldestInboxTimeToken = null;
      vm.oldestChatTimeToken = null;

      vm.currentMessages = [];

      /* Private messages element:
       { user:
         email:
         text:  }
       */

      vm.privateMessages = [];
      /* Private messages element:
         { user:
           email:
           text:
           new: //indicates that there is a new unread message
           selected:  }
       */

      vm.groupChannels = [];
      /* Group Channel elements
        { name:
          new:
          selected:  }
       */


      /*
       * Group channel initialization for each user
       */
      vm.groupChannelInitialization = function () {
        /*
         * Identify list of default channels
         * Format: University + Channel Name
         */
        var universityChannel = JSON.stringify("#" + vm.education.relatedUniversityId.shortName);
        var careerCenterChannel = JSON.stringify("#" + vm.education.relatedUniversityId.shortName + " Career Center");
        var resLifeChannel = JSON.stringify("#" + vm.education.relatedUniversityId.shortName + " ResLife");
        var academicAdvisingChannel = JSON.stringify("#" + vm.education.relatedUniversityId.shortName + " Academic Advising");
        var finAidChannel = JSON.stringify("#" + vm.education.relatedUniversityId.shortName + " Financial Aid");

        /*
         * Remove quotation from the JSON stringify
         */
        var universityChannelText = vm.replaceQuotesFunction (universityChannel);
        var careerCenterChannelText = vm.replaceQuotesFunction (careerCenterChannel);
        var resLifeChannelText = vm.replaceQuotesFunction (resLifeChannel);
        var academicAdvisingChannelText = vm.replaceQuotesFunction (academicAdvisingChannel);
        var finAidChannelText = vm.replaceQuotesFunction (finAidChannel);

        /*
         * Assign channel names to the groupChannels array
         */
        vm.groupChannels = [
          { "name": universityChannelText,
            "new": 0,
            "selected": 0},

          { "name": careerCenterChannelText,
            "new": 0,
            "selected": 0},

          { "name": resLifeChannelText,
            "new": 0,
            "selected": 0},

          { "name": academicAdvisingChannelText,
            "new": 0,
            "selected": 0},

          { "name": finAidChannelText,
            "new": 0,
            "selected": 0}
        ];

      };

      /*
       * Removes quotation from the JSON stringify
       */
      vm.replaceQuotesFunction = function (channel) {
        return channel.replace(/\"/g, "");
      };

      /* Note: When recieving a payload form a subscribed channel,
               The actual message is the 0th element in the object
       */


      /* Convention of a pubnub message:

       { "user": "",
         "email": "",
         "text": ""
        }

       */

      /* PubNub init code
       * Keys used are from Sandbox - TODO - change before launching
       */
      PubNub.init({
        publish_key: 'pub-c-cd12098a-7ff3-4558-921b-c4c7a70ed47a',
        subscribe_key: 'sub-c-fb61f4f0-2402-11e5-8463-02ee2ddab7fe',
        uuid: email, //use existing user's ID as the UUID - unique user ID
        ssl: true
      });


      /* Function: Create a new privateMessage element to add to sidebar, this is meant to be
       *            called and it will append a new private message element to the
       *           privateMessages array
       *
       *   1. Searches the current private messages array to see if there is one already
       *   2. If one is found, currentsSubscribe to that channel
       *   3. Else create a new element to append to the private messages array
       */
      vm.newPrivateConversation = function(user, email){
        for(var i = 0; i < vm.privateMessages.length; i++){
          if(vm.privateMessages[i].email == email){
            vm.privateCurrentSubscribe(email);
            return;
          }
        }

        var newConvo = { "user": user,
                        "email": email,
                        "text": "" };

        console.log(newConvo);

        PubNub.ngPublish({
                      channel: vm.me.email,
                      message: newConvo
        });

        //set timeout is required
        setTimeout(function(){vm.privateCurrentSubscribe(vm.privateMessages[0].email)}, 100);

      };


      /* Intended to be used to subscribe to user's personal private message channel, executed on
         app load.

         1. Subscribes to the user's personal inbox
         2. When we get a new message, we call the function to re-evaluate the private messages array
       */
      vm.privateSubscribe = function (theChannel) {

        // Subscribe to the channel via PubNub
        PubNub.ngSubscribe({channel: theChannel,
                            message: function(message) {

                              vm.evaluateNewPrivateMessage(message[0]);
                            }
                           });

        vm.grabInboxHistory();

        console.log("subscribed to: " + theChannel);
      };



      /* currentSubscribe to a private messaging channel

         1. Computes the hash code for the current user's email and private message target's email
         2. Calls on currentSubscribe passing in the email and private message target's email
       */
      vm.privateCurrentSubscribe = function(email){
        var hashedChannelName = vm.privateChannelHashCode(vm.me.email, email);
        vm.currentSubscribe(email, hashedChannelName);
      };


      /* A function to to parse new messages from the inbox channel
       and reorganize the private messages array

       1. Check if there is another element with the same email
       2. If yes, splice that off the array
       3. Append the new message to the beginning of the array with new = 1
       4. If the current channel is the same email as the new message, set selected and new to 1,
              else set selected to 0 and new to 1;
       */
      vm.evaluateNewPrivateMessage = function(message){

        for( var i = 0; i < vm.privateMessages.length; i++){
          if(vm.privateMessages[i].email == message.email){
            vm.privateMessages.splice(i, 1);
            break
          }
        }

        if(vm.currentChannel.name == message.email) {
          message.selected = 1;
          message.new = 0;
        } else {
          message.selected = 0;
          message.new = 1;
        }

        vm.privateMessages.unshift(message);
        $scope.$apply();

      };


      /* A function to parse old messages (history) from the inbox channel and add
       to the end of the private message array

       1. Check if there is another element with the same email
       2. If yes, do nothing
       3. Else add to the END of the array with new = 0 and selected = 0;
       */
      vm.evaluateOldPrivateMessage = function(message){

        for( var i = 0; i < vm.privateMessages.length; i++){

          if(vm.privateMessages[i].email == message.email){
            return;
          }
        }
        message.new = 0;
        message.selected = 0;

        vm.privateMessages.push(message);
        $scope.$apply();
      };

      /* Function: For the private message inbox, grab older chat history and evaluate

       1. Using the oldest inbox timetoken, we make a call to pubnub history.
       2. With the returned messages array, we call evaluateOldPrivateMessage on each message
       3. Set the new oldest inbox time token to the time token of the oldest message
       */
      vm.grabInboxHistory = function(){

        var retrievedHistory = [];

        PubNub.jsapi.history({
          channel: vm.me.email,
          reverse: false,
          count: 2,
          start: vm.oldestInboxTimeToken,
          include_token: true,
          callback: function(m){
            retrievedHistory = m[0];

            console.log('retrived history');
            for (var i = 0; i<retrievedHistory.length; i++) {
              vm.evaluateOldPrivateMessage(retrievedHistory[i].message);
            }

            vm.oldestInboxTimeToken = m[1];
            $scope.$apply();
          }
        });
        // returns: [[message1, message2, ...], oldestTimeToken, newestTimeToken
      };


      /* A function to set the current channels's selected attribute to 1 in order for
       HTML and css to highlight that channel

       1. Iterate through the privateMessages array and check if current channelName matches email
       2. If there is a match, set selected to 1. Otherwise set selected to 0
       3. Repeat and do the same for group channels xcept compare
       */
      vm.updateSelectedChannel = function(){

        for(var i = 0; i < vm.privateMessages.length; i++){
          if(vm.currentChannel.name == vm.privateMessages[i].email) {
            vm.privateMessages[i].selected = 1;
            vm.privateMessages[i].new = 0;
          } else
            vm.privateMessages[i].selected = 0;

        }

        for(var i = 0; i < vm.groupChannels.length; i++){
          if(vm.currentChannel.name == vm.groupChannels[i].name) {
            console.log(vm.groupChannels[i]);
            vm.groupChannels[i].selected = 1;
            vm.groupChannels[i].new = 0;
          } else
            vm.groupChannels[i].selected = 0;
        }

        setTimeout(function(){$scope.$apply();}, 100);

      };


      /* Function: Subscribe to only the name of the channel passed in (group channel)

         1. calls currentSubscribe passing in only the name as first param and second param as null
       */
      vm.groupChannelCurrentSubscribe = function(channelName){
        vm.currentSubscribe(channelName, null);
      };


      /* A function to unsubscribe from the current channel and subscribe to
         the selected channel and show in the chat window.

         1. Unsubscribe from the currentChannel.name and clear the secondaryName and currentMessages array
         2. Subscribes to the chanel name indicated by first or second param (second param has higher precedence)
         2.5. Set the respected currentChannel properties to the params
         3. Makes sure new messages are appended to the end of currentMessages array
         4. Set the currentChannel's secondaryChannel to the 2nd param (used for private messaging)
         5. If secondaryChannel exists, grab history from that channel (private messaging)
         6. Else, grab history from channel name (group chats)
         7. Set the oldest inbox time token to the time token of earliest message
       */
      vm.currentSubscribe = function(channelName, channelSecondaryName){
        vm.currentMessages = [];

          PubNub.ngUnsubscribe({channel: vm.currentChannel.secondaryChannel,
                                callback: function(m){console.log(m);}});


          PubNub.ngUnsubscribe({channel: vm.currentChannel.name,
                                    callback: function(m){console.log(m);}});


        if(channelSecondaryName){
          PubNub.ngSubscribe({
            channel: channelSecondaryName,
            message: function(m){
                        console.log(m);
                        vm.evaluateNewMessage(null, m, true);
                        //vm.currentMessages.push(m[0]);
                        $scope.$apply();}
          });

          vm.currentChannel.name = channelName;
          vm.currentChannel.secondaryChannel = channelSecondaryName;
          vm.grabCurrentChatHistory();

        } else if (channelName){

          PubNub.ngSubscribe({
            channel: channelName,
            message: function(m){
                        console.log(m);
                        vm.evaluateNewMessage(null, m, true);
                        //vm.currentMessages.push(m[0]);
                        $scope.$apply();}
          });


          vm.currentChannel.name = channelName;
          vm.currentChannel.secondaryChannel = null;
          vm.grabCurrentChatHistory();
        }

        vm.updateSelectedChannel();
      };


      /* Function: For the current open chat, changes messages's user to null if the previous message is also
                   sent by the same user.

         1. If the message is a new message, check the last element's user. If the messageToEval's user is the same as
            the last message's user, then change the messageToEval's user to null and push to the currentMessages array
         2. If yes, newMessage is not true, that means we are getting history/old messages.
         3. We iterate through the old messages list in reverse and check if the previous user is the same as the element before hand.
         4. If yes, set user to null. Then unshift to the currentMessages array
       */
      vm.evaluateNewMessage = function(messageArray, messageToEval, newMessage){

        if(newMessage){
          if(vm.currentMessages.length > 0) {
            if (vm.currentMessages[vm.currentMessages.length - 1].email == messageToEval[0].email) {
              messageToEval[0].user = null;
            }
          }
            console.log(vm.getTime(Number(messageToEval[1][1])));
            vm.currentMessages.push(messageToEval[0]);

        } else if (newMessage == false){

          for(var i = messageArray.length - 1; i >=0; i--){
            if( i != 0) {
              if (messageArray[i].message.email == messageArray[i - 1].message.email) {
                messageArray[i].message.user = null;
              }
            }


            console.log(vm.getTime(Number(messageArray[i].timetoken)));
            vm.currentMessages.unshift(messageArray[i].message);
          }

        }

      };


      /* Function: For the current open chat, grab chat history and append to array

         1. We make a call to Pubnub's history api
         2. With the returned messages array, we append each of the elements to the beginning of currentMessages array
         3. Set the new oldest time token to the time token of the oldest message
       */
      vm.grabCurrentChatHistory = function(){

        if(vm.currentChannel.secondaryChannel)
          var channelName = vm.currentChannel.secondaryChannel;
        else
          var channelName = vm.currentChannel.name;

        var retrievedHistory = [];

        PubNub.jsapi.history({
          channel: channelName,
          count: 4,
          reverse: false,
          include_token: true,
          callback: function(m){
            retrievedHistory = m[0];

            vm.evaluateNewMessage(retrievedHistory, null, false);

            vm.oldestChatTimeToken = m[1];
            $scope.$apply();
          }
        });
        // returns: [[message1, message2, ...], oldestTimeToken, newestTimeToken
      };


      /* Function: For the current open chat, grab older history and append to the beginning of currentMessages
       array
       1. Using the oldest inbox timetoken, we make a call to pubnub history.
       2. With the returned messages array, we append each of the elements to the beginning of currentMessages array
       3. Set the new oldest time token to the time token of the oldest message
       */
      vm.grabOlderCurrentChatHistory = function(){

        if(vm.currentChannel.secondaryChannel)
          var channelName = vm.currentChannel.secondaryChannel;
        else
          var channelName = vm.currentChannel.name;

        var retrievedHistory = [];

        PubNub.jsapi.history({
          channel: channelName,
          reverse: false,
          count: 4,
          start: vm.oldestChatTimeToken,
          include_token: true,
          callback: function(m){
            retrievedHistory = m[0];


            vm.evaluateNewMessage(retrievedHistory, null, false);

            vm.oldestChatTimeToken = m[1];
            $scope.$apply();
          }
        });
        // returns: [[message1, message2, ...], oldestTimeToken, newestTimeToken
      };



      /* A function to publish to the currently selected channel,

         1. Checks to see if the currentChannel's secondaryChannel exists
         2. If it does, means its a private channel and publishes to both channels
         3. Else publishes to only the channel name
         4. Resets the newMessage
       */
      vm.currentPublish = function(){
        if(vm.currentChannel.secondaryChannel)
          vm.publish(vm.currentChannel.secondaryChannel);

        if(vm.currentChannel.name)
          vm.publish(vm.currentChannel.name);

      };

      /* A function to publish to the specified channel
        NOTE: Does not specifically publish to current channel
       */
      vm.publish = function(channel){
        //Publishes to pubnub the message
        PubNub.ngPublish({
          channel: channel,
          message: {
            "user": vm.me.firstname,
            "email": vm.me.email,
            "text": vm.newMessage
          }
        });

        vm.newMessage = '';
      };



      /* This is used to find the hashed channel between two emails, and returns that channel name
       How this is accomplished: The hashed channel name should be a format of the
       following: "email1+email2". We determine email one and two by alphabetizing the emails.
       Whichever is "higher" alphabetized is determined to be email1 and the other to be
       email2
       */
      vm.privateChannelHashCode = function (emailOne, emailTwo) {
        // variable declarations
        var shorterEmail;
        var longerEmail;
        var greaterThanEmail;
        var lessThanEmail;

        // determine which email is shorter
        if (emailOne.length <= emailTwo.length) {
          shorterEmail = emailOne;
          longerEmail = emailTwo;
        } else {
          shorterEmail = emailTwo;
          longerEmail = emailOne;
        }

        // initial assignments
        lessThanEmail = shorterEmail;
        greaterThanEmail = longerEmail;

        // compare each characters of the emails, if one email's character
        // is closer to the beginning compared to teh the other email, then we set
        // that as the "lessThan" email and the other as the "greaterThan" email
        for (var i = 0; i < shorterEmail.length; i++) {


          if (shorterEmail.charCodeAt(i) < longerEmail.charCodeAt(i)) {
            console.log(shorterEmail.charCodeAt(i) + " vs " + longerEmail.charCodeAt(i));
            lessThanEmail = shorterEmail;
            greaterThanEmail = longerEmail;
            break;

          } else if (shorterEmail.charCodeAt(i) > longerEmail.charCodeAt(i)) {
            lessThanEmail = longerEmail;
            greaterThanEmail = shorterEmail;
            break;
          }
        }

        console.log(lessThanEmail + '+&+' + greaterThanEmail);

        return lessThanEmail + '+&+' + greaterThanEmail;

      };

      /* Function: Given a unix time token, converts it to a date and returns a string */
      vm.getTime = function (token){
        token = Math.floor(token/timeConvert);

        var date = new Date(token);
        var hours = date.getHours();

        if(hours < 12){
          var period = ' am';
        } else {
          hours = hours - 12;
          var period = ' pm';
        }

        var minutes = "0" + date.getMinutes();

        return (hours + ':' + minutes.substr(-2) + period);

      };


      /* for punub history, we add the new messages starting from the end of the history messages array,
         and add to the beginning of the currentMessages array. To stay in chronological order
       */

      vm.groupChannelInitialization();
      vm.currentSubscribe('testMe', 'testMe2');
      console.log(vm.groupChannels);
      vm.privateChannelHashCode('aayang@ucsd.edu', 'asdf@ucsd.edu');
      vm.privateSubscribe(vm.me.email);


    }
  };

}());
