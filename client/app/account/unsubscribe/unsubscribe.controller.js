(function () {
  "use strict";

  angular
    .module('app.account')
    .controller('UnsubscribeCtrl', UnsubscribeCtrl);

  UnsubscribeCtrl.$inject = ['common', 'currentUser'];

  function UnsubscribeCtrl(common, currentUser) {
    var vm = this;
    vm.me = currentUser;

    if(window.Gdistinct_id) {
      mixpanel.track("unsubscribe view");
    }

    vm.unsubscribe= function () {
      vm.submitted = true;
      common.Auth.unsubscribeUser(vm.me)
          .then(function(data) {
            if (data.status == 'success'){
              mixpanel.track("User unsubscribe successfully",{distinct:Gdistinct_id});
              vm.showSuccess = true;
            }
          })
          .catch(function() {
            vm.showFail = true;
            mixpanel.track("User unsubscribe failure",{distinct:Gdistinct_id});
          });
    }
  }

}());
