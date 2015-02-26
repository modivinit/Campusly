/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'property-custom.js' file in this directory.
2. Copy the code below and paste it into 'property-custom.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('models\index.js'),
    model   = require('./property.js'),
    util    = require('./utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:
util.getRelation("ids").onDelete = 'CASCADE';
util.getAttribute("id").comment = 'This is the comment';

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "property",
    options: {
        tableName: "property",
    //    schema: "rented",
        timestamps: false
    },
    attributes: {
        "id": {
            type: Seq.BIGINT,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: "property_pkey"
        },
        "streetNumeric": {
            type: Seq.INTEGER,
            field: "streetNumeric",
            allowNull: false
        },
        "streetAddress": {
            type: Seq.STRING(255),
            field: "streetAddress",
            allowNull: false
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
            type: Seq.BIGINT,
            field: "zip",
            allowNull: false
        },
        "apt": {
            type: Seq.STRING(6),
            field: "apt"
        },
        "bldg": {
            type: Seq.STRING(10),
            field: "bldg"
        },
        "latitude": {
            type: Seq.DECIMAL(10, 8),
            field: "latitude"
        },
        "longitude": {
            type: Seq.DECIMAL(11, 8),
            field: "longitude"
        },
        "type": {
            type: Seq.CHAR(255),
            field: "type"
        },
        "description": {
            type: Seq.STRING(255),
            field: "description"
        },
        "bedrooms": {
            type: Seq.BIGINT,
            field: "bedrooms"
        },
        "bathrooms": {
            type: Seq.BIGINT,
            field: "bathrooms"
        },
        "parkingSpots": {
            type: Seq.BIGINT,
            field: "parkingSpots"
        },
        "livingAreaSqFt": {
            type: Seq.BIGINT,
            field: "livingAreaSqFt"
        },
        "hoaFee": {
            type: Seq.INTEGER,
            field: "hoaFee"
        },
        "otherFee": {
            type: Seq.INTEGER,
            field: "otherFee"
        },
        "status": {
            type: Seq.CHAR(255),
            field: "status"
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
        type: "hasMany",
        model: "lease",
        schema: "rented",
        table: "lease",
        source: "generator",
        details: {
            as: "ids",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "propertyImages",
        schema: "rented",
        table: "property_images",
        source: "generator",
        details: {
            as: "imagesProperties",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "propertyLeaseDefaults",
        schema: "rented",
        table: "property_lease_defaults",
        source: "generator",
        details: {
            as: "leasedefaultsProperties",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "propertyLikes",
        schema: "rented",
        table: "property_likes",
        source: "generator",
        details: {
            as: "likesProperties",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "propertyListing",
        schema: "rented",
        table: "property_listing",
        source: "generator",
        details: {
            as: "listingProperties",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "propertyOwnership",
        schema: "rented",
        table: "property_ownership",
        source: "generator",
        details: {
            as: "fKs",
            foreignKey: "propertyFK",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "rentalApplication",
        schema: "rented",
        table: "rental_application",
        source: "generator",
        details: {
            as: "propFKs",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "hasMany",
        model: "roomListing",
        schema: "rented",
        table: "room_listing",
        source: "generator",
        details: {
            as: "roomlistingProperties",
            foreignKey: "propertyId",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsToMany",
        model: "propertyListing",
        schema: "rented",
        table: "property_listing",
        source: "generator",
        details: {
            as: "relatedImagesPropertyListingIds",
            foreignKey: "propertyId",
            otherKey: "listingId",
            through: "property_images",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsToMany",
        model: "rentedUser",
        schema: "rented",
        table: "rented_user",
        source: "generator",
        details: {
            as: "relatedLeasedefaultsPropertyOwnerIds",
            foreignKey: "propertyId",
            otherKey: "ownerId",
            through: "property_lease_defaults",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsToMany",
        model: "rentedUser",
        schema: "rented",
        table: "rented_user",
        source: "generator",
        details: {
            as: "relatedLikesPropertyUserIds",
            foreignKey: "propertyId",
            otherKey: "userId",
            through: "property_likes",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }, {
        type: "belongsToMany",
        model: "rentedUser",
        schema: "rented",
        table: "rented_user",
        source: "generator",
        details: {
            as: "relatedRoomlistingPropertyCreatorIds",
            foreignKey: "propertyId",
            otherKey: "creatorId",
            through: "room_listing",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }
    }]
};
