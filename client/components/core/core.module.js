(function () {
  'use strict';

  angular
    .module('app.core', [
    /*
     * Angular modules
     */
    'ngCookies', 'ngResource', 'ngSanitize', 'ngAnimate',
    'ui.router', 'ui.bootstrap',  'mgcrea.ngStrap', 'ngStorage',
    /*
     * Our reusable cross app code modules
     */
    'btford.socket-io', 'blocks.logger', 'blocks.exception'

    /*
     * 3rd Party modules
     */
  ]);
})();
