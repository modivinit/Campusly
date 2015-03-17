/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'room_listing-custom.js' file in this directory.
2. Copy the code below and paste it into 'room_listing-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('temp_models/index.js'),
    model   = require('./room_listing.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:
util.getRelation("relatedPropertyId").onDelete = 'CASCADE';
util.getAttribute("id").comment = 'This is the comment';

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "roomListing",
    options: {
        tableName: "room_listing",
    //    schema: "public",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.BIGINT,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: "idx_42007_PRIMARY"
        },
        "propertyId": {
            type: Seq.BIGINT,
            field: "propertyId",
            allowNull: false,
            references: "property",
            referencesKey: "propertyId"
        },
        "creatorId": {
            type: Seq.BIGINT,
            field: "creatorId",
            allowNull: false,
            references: "rented_user",
            referencesKey: "creatorId"
        },
        "monthlyPrice": {
            type: Seq.FLOAT(53),
            field: "monthlyPrice",
            allowNull: false
        },
        "securityDeposit": {
            type: Seq.FLOAT(53),
            field: "securityDeposit"
        },
        "availableMoveIn": {
            type: Seq.DATE,
            field: "availableMoveIn",
            allowNull: false
        },
        "leaseEndDate": {
            type: Seq.DATE,
            field: "leaseEndDate"
        },
        "leaseType": {
            type: Seq.ENUM('sub-lease', 'month-to-month', 'lease take over'),
            field: "leaseType",
            allowNull: false
        },
        "gender": {
            type: Seq.ENUM('no preference', 'male only', 'female only'),
            field: "gender",
            allowNull: false
        },
        "monthlyUtilityCost": {
            type: Seq.INTEGER,
            field: "monthlyUtilityCost",
            allowNull: false
        },
        "roomType": {
            type: Seq.ENUM('single', 'double', 'loft', 'living room'),
            field: "roomType",
            allowNull: false
        },
        "sharedBathroom": {
            type: Seq.BOOLEAN,
            field: "sharedBathroom"
        },
        "numRoomates": {
            type: Seq.INTEGER,
            field: "numRoomates",
            allowNull: false
        },
        "furnished": {
            type: Seq.BOOLEAN,
            field: "furnished"
        },
        "parkingAvailable": {
            type: Seq.BOOLEAN,
            field: "parkingAvailable"
        },
        "smokingAllowed": {
            type: Seq.BOOLEAN,
            field: "smokingAllowed"
        },
        "petsAllowed": {
            type: Seq.BOOLEAN,
            field: "petsAllowed"
      },
        "activeRoom": {
            type: Seq.BOOLEAN,
            field: "activeRoom",
            allowNull: false
        },
        "description": {
            type: Seq.TEXT,
            field: "description"
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
    relations: [{
        type: "belongsTo",
        model: "property",
        schema: "public",
        table: "property",
        source: "generator",
        details: {
            as: "relatedPropertyId",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsTo",
        model: "rentedUser",
        schema: "public",
        table: "rented_user",
        source: "generator",
        details: {
            as: "relatedCreatorId",
            foreignKey: "creatorId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};
