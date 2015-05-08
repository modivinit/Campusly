/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

 DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

 To modify this model:
 1. Create 'rented_user-custom.js' file in this directory.
 2. Copy the code below and paste it into 'rented_user-custom.js'.
 3. Use utility methods to easily access orm properties.

 "use strict";
 var orm     = require('models\index.js'),
 model   = require('./rented_user.js'),
 util    = require('./utils.js')(model),
 Seq     = orm.Sequelize();

 module.exports = model;

 // Some utility methods:
 util.getRelation("addresshistoryUsers").onDelete = 'CASCADE';
 util.getAttribute("id").comment = 'This is the comment';

 ------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
  Seq = orm.Sequelize();
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var validatePresenceOf = function (value) {
  return value && value.length;
};
module.exports = {
  modelName: "rentedUser",
  options: {
    tableName: "rented_user",
    //schema: "public",
    timestamps: false,
    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'name': this.name,
          'role': this.role
        };
      },
      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'id': this.id,
          'role': this.role
        };
      }
    },

    /**
     * Pre-save hooks
     */
    hooks: {
      beforeBulkCreate: function (users, fields, fn) {
        var totalUpdated = 0;
        users.forEach(function (user) {
          user.updatePassword(function (err) {
            if (err) {
              return fn(err);
            }
            totalUpdated += 1;
            if (totalUpdated === users.length) {
              return fn();
            }
          });
        });
      },
      beforeCreate: function (user, fields, fn) {
        user.updatePassword(fn);
      },
      beforeUpdate: function (user, fields, fn) {
        if (user.changed('password')) {
          user.updatePassword(fn);
        } else {
          fn()
        }
      }
    },

    /**
     * Instance Methods
     */
    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate: function (password, callback) {
        if (!callback) {
          return this.password === this.encryptPassword(password);
        }

        var _this = this;
        this.encryptPassword(password, function (err, pwdGen) {
          if (err) {
            callback(err);
          }

          if (_this.password === pwdGen) {
            callback(null, true);
          }
          else {
            callback(null, false);
          }
        });
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt: function (byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
          callback = arguments[0];
          byteSize = defaultByteSize;
        }
        else if (typeof arguments[1] === 'function') {
          callback = arguments[1];
        }

        if (!byteSize) {
          byteSize = defaultByteSize;
        }

        if (!callback) {
          return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, function (err, salt) {
          if (err) {
            callback(err);
          }
          return callback(null, salt.toString('base64'));
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
          if (!callback) {
            return null;
          }
          return callback(null);
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
          return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
            .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
          function (err, key) {
            if (err) {
              callback(err);
            }
            return callback(null, key.toString('base64'));
          });
      },

      confirmMail: function (cb) {
        this.confirmedEmail = true;
        //clean up user after successful confirmation
        this.updatedAt = null;
        this.googleOAuthId = null;
        this.save()
          .then(cb());
      },

      setVerificationData: function (token, cb) {
        var current = new Date();
        var plusOnehour = new Date(current);
        //expiration token set to 60min
        plusOnehour.setHours(current.getHours()+1);
        this.updatedAt = plusOnehour;
        this.googleOAuthId = token;
        this.save()
          .then(cb());
      },

      /**
       * Update password field
       *
       * @param {Function} fn
       * @return {String}
       * @api public
       */
      updatePassword: function (fn) {
        // Handle new/update passwords
        if (this.password) {
          if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
            fn(new Error('Invalid password'));
          }

          // Make salt with a callback
          var _this = this;
          this.makeSalt(function (saltErr, salt) {
            if (saltErr) {
              fn(saltErr);
            }
            _this.salt = salt;
            _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
              if (encryptErr) {
                fn(encryptErr);
              }
              _this.password = hashedPassword;
              fn(null);
            });
          });
        } else {
          fn(null);
        }
      }
    }
  },
  attributes: {
    "id": {
      type: Seq.BIGINT,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: "idx_41960_PRIMARY"
    },
    "username": {
      type: Seq.TEXT,
      field: "username"
    },
    "email": {
      type: Seq.TEXT,
      field: "email",
      unique: true,
      allowNull: false
      , validate: {
        isValidEmail: function (value) {
          if((/\.edu$/.test(value.toLowerCase()) || (/campusly.org$/.test(value.toLowerCase())))){
            return true;
          }else{
            throw new Error('Only .edu e-mails are allowed!')
          }
        },
        isEmail: true,
        notEmpty: true
      }
    },
    "confirmedEmail": {
      type: Seq.BOOLEAN,
      field: "confirmedEmail",
      allowNull: false
    },
    "password": {
      type: Seq.TEXT,
      field: "password",
      allowNull: false,
      validate:{
        passwordLength: function (value) {
          if(value.toString().length>=8){
            return true;
          } else {
            throw new Error('password must at least 8 characters long!')
          }
        }
      }
    },
    "firstname": {
      type: Seq.TEXT,
      field: "firstname",
      allowNull: false
    },
    "lastname": {
      type: Seq.TEXT,
      field: "lastname",
      allowNull: false
    },
    "middlename": {
      type: Seq.TEXT,
      field: "middlename"
    },
    "aboutMe": {
      type: Seq.TEXT,
      field: "aboutMe"
    },
    "phone": {
      type: Seq.BIGINT,
      field: "phone"
    },
    "profileImage": {
      type: Seq.TEXT,
      field: "profileImage"
    },
    "twitter": {
      type: Seq.TEXT,
      field: "twitter"
    },
    "facebook": {
      type: Seq.TEXT,
      field: "facebook"
    },
    "googleplus": {
      type: Seq.TEXT,
      field: "googleplus"
    },
    "linkedin": {
      type: Seq.TEXT,
      field: "linkedin"
    },
    "experianIdToken": {
      type: Seq.TEXT,
      field: "experianIdToken"
    },
    "creditCheckToken": {
      type: Seq.TEXT,
      field: "creditCheckToken"
    },
    "runIdentityCheck": {
      type: Seq.BOOLEAN,
      field: "runIdentityCheck",
      allowNull: false
    },
    "shareCreditReport": {
      type: Seq.BOOLEAN,
      field: "shareCreditReport",
      allowNull: false
    },
    "shareProfile": {
      type: Seq.BOOLEAN,
      field: "shareProfile"
    },
    "identityDate": {
      type: Seq.DATE,
      field: "identityDate"
    },
    "creditReportDate": {
      type: Seq.DATE,
      field: "creditReportDate"
    },
    "createdAt": {
      type: Seq.DATE,
      field: "createdAt",
      allowNull: false
    },
    "updatedAt": {
      type: Seq.DATE,
      field: "updatedAt"
    },
    "deletedAt": {
      type: Seq.DATE,
      field: "deletedAt"
    },
    "role": {
      type: Seq.TEXT,
      field: "role"
    },
    "provider": {
      type: Seq.TEXT,
      field: "provider"
    },
    "facebookOAuthId": {
      type: Seq.TEXT,
      field: "facebookOAuthId"
    },
    "googleOAuthId": {
      type: Seq.TEXT,
      field: "googleOAuthId"
    },
    "twitterOAuthId": {
      type: Seq.TEXT,
      field: "twitterOAuthId"
    },
    "salt": {
      type: Seq.TEXT,
      field: "salt",
      allowNull: false
    }
  },
  relations: [{
    type: "hasMany",
    model: "addressHistory",
    schema: "public",
    table: "address_history",
    source: "generator",
    details: {
      as: "addresshistoryUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "friend",
    schema: "public",
    table: "friend",
    source: "generator",
    details: {
      as: "friendFriendIds",
      foreignKey: "friendId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "friend",
    schema: "public",
    table: "friend",
    source: "generator",
    details: {
      as: "friendUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "invitee",
    schema: "public",
    table: "invitee",
    source: "generator",
    details: {
      as: "inviteeInvitorIds",
      foreignKey: "invitorId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "lessee",
    schema: "public",
    table: "lessee",
    source: "generator",
    details: {
      as: "lesseeUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "payment",
    schema: "public",
    table: "payment",
    source: "generator",
    details: {
      as: "paymentPayees",
      foreignKey: "payeeId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "payment",
    schema: "public",
    table: "payment",
    source: "generator",
    details: {
      as: "paymentPayers",
      foreignKey: "payerId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "pet",
    schema: "public",
    table: "pet",
    source: "generator",
    details: {
      as: "petsUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "propertyLeaseDefaults",
    schema: "public",
    table: "property_lease_defaults",
    source: "generator",
    details: {
      as: "propertyleasedefaultsOwners",
      foreignKey: "ownerId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "propertyLikes",
    schema: "public",
    table: "property_likes",
    source: "generator",
    details: {
      as: "propertylikesUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "propertyOwner",
    schema: "public",
    table: "property_owner",
    source: "generator",
    details: {
      as: "propertyownerUsers",
      foreignKey: "ownerId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "rentalApplicant",
    schema: "public",
    table: "rental_applicant",
    source: "generator",
    details: {
      as: "rentalapplicantUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "roomListing",
    schema: "public",
    table: "room_listing",
    source: "generator",
    details: {
      as: "roomlistingUsers",
      foreignKey: "creatorId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "roommate",
    schema: "public",
    table: "roommate",
    source: "generator",
    details: {
      as: "roommateRommieIds",
      foreignKey: "roommateId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "roommate",
    schema: "public",
    table: "roommate",
    source: "generator",
    details: {
      as: "roommateUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userCosigner",
    schema: "public",
    table: "user_cosigner",
    source: "generator",
    details: {
      as: "usercosignerCosginers",
      foreignKey: "cosginerId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userCosigner",
    schema: "public",
    table: "user_cosigner",
    source: "generator",
    details: {
      as: "usercosignerCosingees",
      foreignKey: "cosingeeId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userEducation",
    schema: "public",
    table: "user_education",
    source: "generator",
    details: {
      as: "usereducationUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userFinancial",
    schema: "public",
    table: "user_financial",
    source: "generator",
    details: {
      as: "userfinancialsUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userOccupation",
    schema: "public",
    table: "user_occupation",
    source: "generator",
    details: {
      as: "useroccupationUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userRecommendation",
    schema: "public",
    table: "user_recommendation",
    source: "generator",
    details: {
      as: "userrecommendationsRecommendeds",
      foreignKey: "recommendedId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userRecommendation",
    schema: "public",
    table: "user_recommendation",
    source: "generator",
    details: {
      as: "userrecommendationsRecommendors",
      foreignKey: "recommendorId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userReference",
    schema: "public",
    table: "user_reference",
    source: "generator",
    details: {
      as: "userreferencesUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userVehicle",
    schema: "public",
    table: "user_vehicle",
    source: "generator",
    details: {
      as: "uservehiclesUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "hasMany",
    model: "userStatus",
    schema: "public",
    table: "user_status",
    source: "generator",
    details: {
      as: "userstatusesUsers",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedFriendFriendIdUserIds",
      foreignKey: "friendId",
      otherKey: "userId",
      through: "friend",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedFriendUserFriendIds",
      foreignKey: "userId",
      otherKey: "friendId",
      through: "friend",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "lease",
    schema: "public",
    table: "lease",
    source: "generator",
    details: {
      as: "relatedLesseeUserLeaseIds",
      foreignKey: "userId",
      otherKey: "leaseId",
      through: "lessee",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedPaymentPayeePayerIds",
      foreignKey: "payeeId",
      otherKey: "payerId",
      through: "payment",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedPaymentPayerPayeeIds",
      foreignKey: "payerId",
      otherKey: "payeeId",
      through: "payment",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "property",
    schema: "public",
    table: "property",
    source: "generator",
    details: {
      as: "relatedPropertyleasedefaultsOwnerPropertyIds",
      foreignKey: "ownerId",
      otherKey: "propertyId",
      through: "property_lease_defaults",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "property",
    schema: "public",
    table: "property",
    source: "generator",
    details: {
      as: "relatedPropertylikesUserPropertyIds",
      foreignKey: "userId",
      otherKey: "propertyId",
      through: "property_likes",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "propertyOwnership",
    schema: "public",
    table: "property_ownership",
    source: "generator",
    details: {
      as: "relatedPropertyownerUserPropertyOwnershipIds",
      foreignKey: "ownerId",
      otherKey: "propertyOwnershipId",
      through: "property_owner",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentalApplication",
    schema: "public",
    table: "rental_application",
    source: "generator",
    details: {
      as: "relatedRentalapplicantUserRentalAppIds",
      foreignKey: "userId",
      otherKey: "rentalAppId",
      through: "rental_applicant",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "property",
    schema: "public",
    table: "property",
    source: "generator",
    details: {
      as: "relatedRoomlistingUserPropertyIds",
      foreignKey: "creatorId",
      otherKey: "propertyId",
      through: "room_listing",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedRoommateRommieIdUserIds",
      foreignKey: "roommateId",
      otherKey: "userId",
      through: "roommate",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedRoommateUserRoommateIds",
      foreignKey: "userId",
      otherKey: "roommateId",
      through: "roommate",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedUsercosignerCosginerCosingeeIds",
      foreignKey: "cosginerId",
      otherKey: "cosingeeId",
      through: "user_cosigner",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedUsercosignerCosingeeCosginerIds",
      foreignKey: "cosingeeId",
      otherKey: "cosginerId",
      through: "user_cosigner",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
    type: "belongsToMany",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedUserrecommendationsRecommendedRecommendorIds",
      foreignKey: "recommendedId",
      otherKey: "recommendorId",
      through: "user_recommendation",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }, {
  type: "belongsToMany",
  model: "rentedUser",
  schema: "public",
  table: "rented_user",
  source: "generator",
  details: {
    as: "relatedUserrecommendationsRecommendorRecommendedIds",
    foreignKey: "recommendorId",
    otherKey: "recommendedId",
    through: "user_recommendation",
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  }
  }]
};
