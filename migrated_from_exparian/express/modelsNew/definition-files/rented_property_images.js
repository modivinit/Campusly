/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'property_images-custom.js' file in this directory.
2. Copy the code below and paste it into 'property_images-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('model\index.js'),
    model   = require('./property_images.js'),
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
    modelName: "rented.propertyImages",
    options: {
        tableName: "property_images",
        schema: "rented",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.BIGINT,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: "property_images_pkey"
        },
        "listingId": {
            type: Seq.BIGINT,
            field: "listingId"
        },
        "propertyId": {
            type: Seq.BIGINT,
            field: "propertyId",
            allowNull: false,
            references: "property",
            referencesKey: "propertyId"
        },
        "location": {
            type: Seq.STRING(255),
            field: "location",
            allowNull: false
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
        model: "rented.property",
        schema: "rented",
        table: "property",
        source: "generator",
        details: {
            as: "relatedPropertyId",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};