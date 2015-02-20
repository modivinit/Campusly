(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$location', 'Property', 'Vehicle', 'Pet', 'Address', 'Education', 'Finance', 'Occupation'];

  function dataservice($http, $location, Property, Vehicle, Pet, Address, Education, Finance, Occupation) {

    var safeCb = function(cb) {
        return (angular.isFunction(cb)) ? cb : angular.noop;
      };

    var service = {
       addProperty:addProperty,
       addVehicle:addVehicle,
       addPet: addPet,
       addAddress: addAddress,
       addEducation:addEducation,
       addOccupation:addOccupation,
       getAllEducations: getAllEducations,
       getAllProperties: getAllProperties,
       deleteEducation:deleteEducation,
       getEducation:getEducation,
       editEducation:editEducation,
       getAllPets: getAllPets,
       deletePet:deletePet,
       getSinglePet:getSinglePet,
       editPet:editPet,
       getAllAddresses: getAllAddresses,
       deleteAddress:deleteAddress,
       getAddress:getAddress,
       editAddress:editAddress,
       addFinance:addFinance,
       getAllFinances: getAllFinances,
       deleteFinance:deleteFinance,
       getFinance:getFinance,
       editFinance:editFinance,
       getAllOccupations: getAllOccupations,
       deleteOccupation:deleteOccupation,
       getOccupation:getOccupation,
       editOccupation:editOccupation,
       getAllVehicles: getAllVehicles,
       deleteVehicle:deleteVehicle,
       getVehicle:getVehicle,
       editVehicle:editVehicle
    };
    return service;

    function addProperty(data) {
      return Property.save(data,
        function(res) {
          return res;
        },
        function(err) {
         //handle this exception
        });
    }

    function addVehicle(userId, data) {
      return Vehicle.save({userId: userId}, data,
        function(res) {
          return res;
        },
        function(err) {
          //handle this exception
        });
    }

    function addPet(userId, data) {
      return Pet.save({userId: userId}, data,
        function(res) {
          return res;
        },
        function(err) {
          //handle this exception
        });
    }

    function addEducation(userId, data) {
      return Education.save({userId: userId}, data,
        function(res) {
          return res;
        },
        function(err) {
          //handle this exception
        });
    }
    function addAddress(userId, data) {
      return Address.save({userId: userId}, data,
        function (res) {
          return res;
        },
        function (err) {
          //handle this exception
        });
    }

    function addFinance(userId, data) {
      return Finance.save({userId: userId}, data,
        function (res) {
          return res;
        },
        function (err) {
          //handle this exception
        });
    }

    function addOccupation(userId, data) {
      return Occupation.save({userId: userId}, data,
        function (res) {
          return res;
        },
        function (err) {
          //handle this exception
        });
    }

    function getAllEducations(userId, data) {
      return Education.getAllEducations({userId: userId}, data,
        function (res) {
          return res;
      }, function (err) {
        //handle exception
      });
    }

    function getAllProperties(userId, data) {
      return Property.getAllProperties({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deleteEducation(userId, educationId, data) {
      return Education.delete({userId: userId, id:educationId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getEducation(userId, educationId, data) {
      return Education.get({userId: userId, id:educationId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editEducation(userId, educationId, data, callback) {
      return Education.editEducation({userId: userId, id:educationId}, data,
        function (edu) {
          return safeCb(callback)(null, edu);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }

    function getAllPets(userId, data) {
      return Pet.getAllPets({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deletePet(userId, petId, data) {
      return Pet.delete({userId: userId, id:petId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getSinglePet(userId, petId, data) {
      return Pet.get({userId: userId, id:petId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editPet(userId, petId, data, callback) {
      return Pet.editPet({userId: userId, id:petId}, data,
        function (edu) {
          return safeCb(callback)(null, edu);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }

    function getAllAddresses(userId, data) {
      return Address.getAllAddresses({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deleteAddress(userId, addressId, data) {
      return Address.delete({userId: userId, id:addressId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getAddress(userId, addressId, data) {
      return Address.get({userId: userId, id:addressId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editAddress(userId, addressId, data, callback) {
      return Address.editAddress({userId: userId, id:addressId}, data,
        function (adr) {
          return safeCb(callback)(null, adr);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }

    function getAllFinances(userId, data) {
      return Finance.getAllFinances({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deleteFinance(userId, financeId, data) {
      return Finance.delete({userId: userId, id:financeId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getFinance(userId, financeId, data) {
      return Finance.get({userId: userId, id:financeId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editFinance(userId, financeId, data, callback) {
      return Finance.editFinance({userId: userId, id:financeId}, data,
        function (res) {
          return safeCb(callback)(null, res);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }

    function getAllOccupations(userId, data) {
      return Occupation.getAllOccupations({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deleteOccupation(userId, occupationId, data) {
      return Occupation.delete({userId: userId, id:occupationId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getOccupation(userId, occupationId, data) {
      return Occupation.get({userId: userId, id:occupationId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editOccupation(userId, occupationId, data, callback) {
      return Occupation.editOccupation({userId: userId, id:occupationId}, data,
        function (res) {
          return safeCb(callback)(null, res);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }

    function getAllVehicles(userId, data) {
      return Vehicle.getAllVehicles({userId: userId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function deleteVehicle(userId, vehicleId, data) {
      return Vehicle.delete({userId: userId, id:vehicleId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function getVehicle(userId, vehicleId, data) {
      return Vehicle.get({userId: userId, id:vehicleId}, data,
        function (res) {
          return res;
        }, function (err) {
          //handle exception
        });
    }

    function editVehicle(userId, vehicleId, data, callback) {
      return Vehicle.editVehicle({userId: userId, id:vehicleId}, data,
        function (res) {
          return safeCb(callback)(null, res);
        }, function (err) {
          return safeCb(callback)(err);
        });
    }



  }
}());
