/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

 DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

 To modify this model:
 1. Create 'user_vehicle-custom.js' file in this directory.
 2. Copy the code below and paste it into 'user_vehicle-custom.js'.
 3. Use utility methods to easily access orm properties.

 "use strict";
 var orm     = require('models\index.js'),
 model   = require('./user_vehicle.js'),
 util    = require('./utils.js')(model),
 Seq     = orm.Sequelize();

 module.exports = model;

 // Some utility methods:
 util.getRelation("relatedUserId").onDelete = 'CASCADE';
 util.getAttribute("id").comment = 'This is the comment';

 ------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
  Seq = orm.Sequelize();
module.exports = {
  modelName: "userStatus",
  options: {
    tableName: "user_status",
    //schema: "public",
    timestamps: false
  },
  attributes: {
    "id": {
      type: Seq.BIGINT,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: "idx_42380_PRIMARY"
    },
    "userId": {
      type: Seq.BIGINT,
      field: "userId",
      references: "rented_user",
      referencesKey: "userId"
    },
    "carpoolingToCampus":{
      type: Seq.BOOLEAN,
      field: "carpoolingToCampus"
    },
    "carpoolingFromCampus":{
      type: Seq.BOOLEAN,
      field: "carpoolingFromCampus"
    },
    "carpoolingForGroceries":{
      type: Seq.BOOLEAN,
      field: "carpoolingForGroceries"
    },
    "carpoolingForRoadtrip":{
      type: Seq.BOOLEAN,
      field: "carpoolingForRoadtrip"
    },
    "carpoolingSplit":{
      type: Seq.BOOLEAN,
      field: "carpoolingSplit"
    },
    "walkingToCampus":{
      type: Seq.BOOLEAN,
      field: "walkingToCampus"
    },
    "walkingFromCampus":{
      type: Seq.BOOLEAN,
      field: "walkingFromCampus"
    },
    "meetForHangout":{
      type: Seq.BOOLEAN,
      field: "meetForHangout"
    },
    "meetForStudy":{
      type: Seq.BOOLEAN,
      field: "meetForStudy"
    },
    "meetForEvents":{
      type: Seq.BOOLEAN,
      field: "meetForEvents"
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
    "carpooling":{
      type: Seq.BOOLEAN,
      field: "carpooling"
    },
    "walking":{
      type: Seq.BOOLEAN,
      field: "walking"
    },
    "meetUp":{
      type: Seq.BOOLEAN,
      field: "meetUp"
    },
    "biking":{
      type: Seq.BOOLEAN,
      field: "biking"
    }
  },
  relations: [{
    type: "belongsTo",
    model: "rentedUser",
    schema: "public",
    table: "rented_user",
    source: "generator",
    details: {
      as: "relatedUserId",
      foreignKey: "userId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION"
    }
  }]
};
