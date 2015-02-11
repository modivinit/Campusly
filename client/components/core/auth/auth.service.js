(function () {
  "use strict";

  angular.module('app.core')
    .factory('Auth', function Auth($http, UserResource, $cookieStore, $q) {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      var safeCb = function(cb) {
          return (angular.isFunction(cb)) ? cb : angular.noop;
        },

        currentUser = {};

      if ($cookieStore.get('token')) {
        currentUser = UserResource.get();
      }

      return {

        /**
         * Authenticate user and save token
         *
         * @param  {Object}   user     - login info
         * @param  {Function} callback - optional, function(error)
         * @return {Promise}
         */
        login: function(user, callback) {
          return $http.post('/auth/local', {
            email: user.email,
            password: user.password
          })
            .then(function(res) {
              $cookieStore.put('token', res.data.token);
              currentUser = UserResource.get();
              safeCb(callback)();
              return res.data;
            }, function(err) {
              this.logout();
              safeCb(callback)(err.data);
              return $q.reject(err.data);
            }.bind(this));
        },

        /**
         * Delete access token and user info
         */
        logout: function() {
          $cookieStore.remove('token');
          currentUser = {};
        },

        /**
         * Create a new user
         *
         * @param  {Object}   user     - user info
         * @param  {Function} callback - optional, function(error, user)
         * @return {Promise}
         */
        createUser: function(user, callback) {
          return UserResource.save(user,
            function(data) {
              $cookieStore.put('token', data.token);
              currentUser = UserResource.get();
              return safeCb(callback)(null, user);
            },
            function(err) {
              this.logout();
              return safeCb(callback)(err);
            }.bind(this)).$promise;
        },

        createProperty: function(property, callback) {
          return PropertyResource.save(property,
            function(data) {
              return safeCb(callback)(null, property);
            },
            function(err) {
              return safeCb(callback)(err);
            }).$promise;
        },

        updateUser: function(user, callback) {
          return UserResource.changeInfo({id: currentUser.id}, user,
            function(usr) {
              return safeCb(callback)(null, usr);
            },
            function(err) {
              return safeCb(callback)(err);
            }).$promise;
        },
        //
        //changeVehicle: function(vehicle, callback) {
        //  return UserResource.changeVehicle({id: currentUser.id}, vehicle,
        //    function(veh) {
        //      return safeCb(callback)(null, veh);
        //    },
        //    function(err) {
        //      // this.logout();
        //      return safeCb(callback)(err);
        //    }).$promise;
        //},

        changePets: function(pets, callback) {
          return UserResource.changePets({id: currentUser.id}, pets,
            function(pet) {
              return safeCb(callback)(null, pet);
            },
            function(err) {
              return safeCb(callback)(err);
            }).$promise;
        },
        /**
         * Change password
         *
         * @param  {String}   oldPassword
         * @param  {String}   newPassword
         * @param  {Function} callback    - optional, function(error, user)
         * @return {Promise}
         */
        changePassword: function(oldPassword, newPassword, callback) {
          return UserResource.changePassword({ id: currentUser.id }, {
            oldPassword: oldPassword,
            newPassword: newPassword
          }, function(user) {
            return safeCb(callback)(null, user);
          }, function(err) {
            return safeCb(callback)(err);
          }).$promise;
        },

        /**
         * Gets all available info on a user
         *   (synchronous|asynchronous)
         *
         * @param  {Function|*} callback - optional, funciton(user)
         * @return {Object|Promise}
         */
        getCurrentUser: function(callback) {
          if (arguments.length === 0) {
            return currentUser;
          }
          var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
          return $q.when(value)
            .then(function(user) {
              safeCb(callback)(user);
              return user;
            }, function() {
              safeCb(callback)({});
              return {};
            });
        },

        /**
         * Check if a user is logged in
         *   (synchronous|asynchronous)
         *
         * @param  {Function|*} callback - optional, function(is)
         * @return {Bool|Promise}
         */
        isLoggedIn: function(callback) {
          if (arguments.length === 0) {
            return currentUser.hasOwnProperty('role');
          }

          return this.getCurrentUser(null)
            .then(function(user) {
              var is = user.hasOwnProperty('role');
              safeCb(callback)(is);
              return is;
            });
        },

        /**
         * Check if a user is an admin
         *   (synchronous|asynchronous)
         *
         * @param  {Function|*} callback - optional, function(is)
         * @return {Bool|Promise}
         */
        isAdmin: function(callback) {
          if (arguments.length === 0) {
            return currentUser.role === 'admin';
          }

          return this.getCurrentUser(null)
            .then(function(user) {
              var is = user.role === 'admin';
              safeCb(callback)(is);
              return is;
            });
        },

        /**
         * Get auth token
         *
         * @return {String} - a token string used for authenticating
         */
        getToken: function() {
          return $cookieStore.get('token');
        }
      };
    });


}());

