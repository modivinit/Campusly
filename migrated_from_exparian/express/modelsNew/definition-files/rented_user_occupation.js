/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'user_occupation-custom.js' file in this directory.
2. Copy the code below and paste it into 'user_occupation-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('model\index.js'),
    model   = require('./user_occupation.js'),
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
    modelName: "rented.userOccupation",
    options: {
        tableName: "user_occupation",
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
            unique: "user_occupation_pkey"
        },
        "role": {
            type: Seq.STRING(45),
            field: "role",
            allowNull: false
        },
        "company": {
            type: Seq.STRING(45),
            field: "company",
            allowNull: false
        },
        "start": {
            type: Seq.DATE,
            field: "start",
            allowNull: false
        },
        "end": {
            type: Seq.DATE,
            field: "end"
        },
        "presentlyEmployeed": {
            type: Seq.BOOLEAN,
            field: "presentlyEmployeed",
            allowNull: false
        },
        "userId": {
            type: Seq.BIGINT,
            field: "userId",
            allowNull: false,
            references: "rented_user",
            referencesKey: "userId"
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
        model: "rented.rentedUser",
        schema: "rented",
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