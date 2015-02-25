/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'invitee-custom.js' file in this directory.
2. Copy the code below and paste it into 'invitee-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('models/index.js'),
    model   = require('./invitee.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:
util.getRelation("relatedInvitorid").onDelete = 'CASCADE'; 
util.getAttribute("id").comment = 'This is the comment'; 

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "rented.invitee",
    options: {
        tableName: "invitee",
        schema: "Rented",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.INTEGER,
            field: "id",
            allowNull: false,
            unique: "invitee_pkey"
        },
        "firstname": {
            type: Seq.STRING(45),
            field: "firstname",
            allowNull: false
        },
        "lastname": {
            type: Seq.STRING(45),
            field: "lastname",
            allowNull: false
        },
        "invitorid": {
            type: Seq.INTEGER,
            field: "invitorid",
            allowNull: false,
            references: "rented_user",
            referencesKey: "invitorid"
        },
        "email": {
            type: Seq.STRING(45),
            field: "email"
        },
        "phone": {
            type: Seq.INTEGER,
            field: "phone"
        },
        "facebook": {
            type: Seq.STRING(45),
            field: "facebook"
        },
        "twitter": {
            type: Seq.STRING(45),
            field: "twitter"
        },
        "googleplus": {
            type: Seq.STRING(45),
            field: "googleplus"
        },
        "linkedin": {
            type: Seq.STRING(45),
            field: "linkedin"
        },
        "viewproperty": {
            type: Seq.INTEGER,
            field: "viewproperty"
        },
        "viewpropertyid": {
            type: Seq.INTEGER,
            field: "viewpropertyid"
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
            as: "relatedInvitorid",
            foreignKey: "invitorid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};