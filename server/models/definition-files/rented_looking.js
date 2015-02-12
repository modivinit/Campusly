/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'looking-custom.js' file in this directory.
2. Copy the code below and paste it into 'looking-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('model\index.js'),
    model   = require('./looking.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:

util.getAttribute("id").comment = 'This is the comment';

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "rented.looking",
    options: {
        tableName: "looking",
        //schema: "rented",
        timestamps: true
    },
    attributes: {
        "id": {
            type: Seq.BIGINT,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: "looking_pkey"
        },
        "maxMonthlyRent": {
            type: Seq.INTEGER,
            field: "maxMonthlyRent",
            allowNull: false
        },
        "utilitiesIncluded": {
            type: Seq.BOOLEAN,
            field: "utilitiesIncluded",
            allowNull: false
        },
        "area": {
            type: Seq.STRING(30),
            field: "area"
        },
        "distanceToUniv": {
            type: Seq.FLOAT(53),
            field: "distanceToUniv"
        },
        "moveInDate": {
            type: Seq.DATE,
            field: "moveInDate",
            allowNull: false
        },
        "lengthOfStay": {
            type: Seq.BIGINT,
            field: "lengthOfStay"
        },
        "longTermIntention": {
            type: Seq.BOOLEAN,
            field: "longTermIntention"
        },
        "openToFullYearLeaseNewRoomates": {
            type: Seq.BOOLEAN,
            field: "openToFullYearLeaseNewRoomates"
        },
        "roomType": {
            type: Seq.CHAR(255),
            field: "roomType"
        },
        "sharedBathroom": {
            type: Seq.BOOLEAN,
            field: "sharedBathroom"
        },
        "gender": {
            type: Seq.CHAR(255),
            field: "gender",
            allowNull: false
        },
        "numRoommates": {
            type: Seq.BIGINT,
            field: "numRoommates"
        },
        "furnished": {
            type: Seq.BOOLEAN,
            field: "furnished"
        },
        "busRouteRequired": {
            type: Seq.BOOLEAN,
            field: "busRouteRequired"
        },
        "parkingNeeded": {
            type: Seq.BOOLEAN,
            field: "parkingNeeded"
        },
        "smokingAllowed": {
            type: Seq.BOOLEAN,
            field: "smokingAllowed"
        },
        "petsAllowed": {
            type: Seq.BOOLEAN,
            field: "petsAllowed"
        },
        "coupleAllowed": {
            type: Seq.BOOLEAN,
            field: "coupleAllowed"
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
        }
    },
    relations: []
};
