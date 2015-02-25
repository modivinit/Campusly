/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'university-custom.js' file in this directory.
2. Copy the code below and paste it into 'university-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('models/index.js'),
    model   = require('./university.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:
util.getRelation("calenderQuaterUniversityidFkeys").onDelete = 'CASCADE'; 
util.getAttribute("id").comment = 'This is the comment'; 

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "public.university",
    options: {
        tableName: "university",
        schema: "public",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.INTEGER,
            field: "id",
            primaryKey: true,
            allowNull: false,
            unique: "university_pkey"
        },
        "name": {
            type: Seq.STRING(255),
            field: "name",
            allowNull: false
        },
        "academicyeartype": {
            type: Seq.STRING(250),
            field: "academicyeartype"
        },
        "streetnumeric": {
            type: Seq.INTEGER,
            field: "streetnumeric",
            allowNull: false
        },
        "streetaddress": {
            type: Seq.STRING(255),
            field: "streetaddress",
            allowNull: false
        },
        "apt": {
            type: Seq.STRING(6),
            field: "apt"
        },
        "city": {
            type: Seq.STRING(30),
            field: "city",
            allowNull: false
        },
        "state": {
            type: Seq.STRING(2),
            field: "state",
            allowNull: false
        },
        "zip": {
            type: Seq.INTEGER,
            field: "zip",
            allowNull: false
        },
        "latitude": {
            type: Seq.DECIMAL(10, 8),
            field: "latitude"
        },
        "longitude": {
            type: Seq.DECIMAL(11, 8),
            field: "longitude"
        },
        "startdate": {
            type: Seq.DATE,
            field: "startdate",
            allowNull: false
        },
        "enddate": {
            type: Seq.DATE,
            field: "enddate"
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
        type: "hasMany",
        model: "public.universityCalenderQuater",
        schema: "public",
        table: "university_calender_quater",
        source: "generator",
        details: {
            as: "calenderQuaterUniversityidFkeys",
            foreignKey: "universityid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "public.universityCalenderSemester",
        schema: "public",
        table: "university_calender_semester",
        source: "generator",
        details: {
            as: "calenderSemesterUniversityidFkeys",
            foreignKey: "universityid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};