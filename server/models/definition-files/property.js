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
            unique: "idx_41807_PRIMARY"
        },
        "streetNumeric": {
            type: Seq.INTEGER,
            field: "streetNumeric",
            allowNull: false
        },
        "streetAddress": {
            type: Seq.TEXT,
            field: "streetAddress",
            allowNull: false
        },
        "city": {
            type: Seq.TEXT,
            field: "city",
            allowNull: false
        },
        "state": {
            type: Seq.TEXT,
            field: "state",
            allowNull: false
        },
        "zip": {
            type: Seq.INTEGER,
            field: "zip",
            allowNull: false
        },
        "apt": {
            type: Seq.TEXT,
            field: "apt"
        },
        "bldg": {
            type: Seq.TEXT,
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
            type: Seq.ENUM('apt', 'sfh', 'townhouse'),
            field: "type"
        },
        "description": {
            type: Seq.TEXT,
            field: "description"
        },
        "bedrooms": {
            type: Seq.INTEGER,
            field: "bedrooms"
        },
        "bathrooms": {
            type: Seq.INTEGER,
            field: "bathrooms"
        },
        "parkingSpots": {
            type: Seq.INTEGER,
            field: "parkingSpots"
        },
        "livingAreaSqFt": {
            type: Seq.INTEGER,
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
            type: Seq.ENUM('avail', 'pending', 'rented'),
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
        schema: "public",
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
