/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'room_listing-custom.js' file in this directory.
2. Copy the code below and paste it into 'room_listing-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('models/index.js'),
    model   = require('./room_listing.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:
util.getRelation("relatedCreatorid").onDelete = 'CASCADE'; 
util.getAttribute("id").comment = 'This is the comment'; 

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "rented.roomListing",
    options: {
        tableName: "room_listing",
        schema: "Rented",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.INTEGER,
            field: "id",
            allowNull: false,
            unique: "room_listing_pkey"
        },
        "propertyid": {
            type: Seq.INTEGER,
            field: "propertyid",
            allowNull: false,
            references: "property",
            referencesKey: "propertyid"
        },
        "creatorid": {
            type: Seq.INTEGER,
            field: "creatorid",
            allowNull: false,
            references: "rented_user",
            referencesKey: "creatorid"
        },
        "monthlyprice": {
            type: Seq.FLOAT(53),
            field: "monthlyprice",
            allowNull: false
        },
        "securitydeposit": {
            type: Seq.FLOAT(53),
            field: "securitydeposit"
        },
        "availablemovein": {
            type: Seq.DATE,
            field: "availablemovein",
            allowNull: false
        },
        "leaseenddate": {
            type: Seq.DATE,
            field: "leaseenddate"
        },
        "leasetype": {
            type: Seq.STRING(250),
            field: "leasetype",
            allowNull: false
        },
        "gender": {
            type: Seq.STRING(250),
            field: "gender",
            allowNull: false
        },
        "monthlyutilitycost": {
            type: Seq.INTEGER,
            field: "monthlyutilitycost",
            allowNull: false
        },
        "roomtype": {
            type: Seq.STRING(250),
            field: "roomtype",
            allowNull: false
        },
        "sharedbathroom": {
            type: Seq.INTEGER,
            field: "sharedbathroom"
        },
        "numroomates": {
            type: Seq.INTEGER,
            field: "numroomates",
            allowNull: false
        },
        "furnished": {
            type: Seq.INTEGER,
            field: "furnished"
        },
        "parkingavailable": {
            type: Seq.INTEGER,
            field: "parkingavailable"
        },
        "smokingallowed": {
            type: Seq.INTEGER,
            field: "smokingallowed"
        },
        "description": {
            type: Seq.STRING(255),
            field: "description"
        },
        "createdat": {
            type: Seq.DATE,
            field: "createdat",
            allowNull: false
        },
        "updatedat": {
            type: Seq.DATE,
            field: "updatedat"
        },
        "deletedat": {
            type: Seq.DATE,
            field: "deletedat"
        }
    },
    relations: [{
        type: "belongsTo",
        model: "rented.rentedUser",
        schema: "Rented",
        table: "rented_user",
        source: "generator",
        details: {
            as: "relatedCreatorid",
            foreignKey: "creatorid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsTo",
        model: "rented.property",
        schema: "Rented",
        table: "property",
        source: "generator",
        details: {
            as: "relatedPropertyid",
            foreignKey: "propertyid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};