var sqldb = require('../../sqldb');
var RoomListing = sqldb.model('roomListing');
var Property = sqldb.model('property');
var _ = require('lodash');



/**
 * Retrieve a specific room listing with both the room listing and property details.  Default behavior is to return
 *  a fully hydrated model unless a filter is used in the query.
 *
 * Attribute filters coming soon in order to specify only what you want in the return object
 *
 * @param req
 * @param res
 * @param next
 */
exports.getRoomListing = function(req, res, next) {

 // console.log('Getting room listing for: ', req.param("id") );

  var roomAttributes = ["monthlyPrice", "securityDeposit", "availableMoveIn", "leaseEndDate", "leaseType", "gender",
    "monthlyUtilityCost", "roomType", "sharedBathroom", "numRoomates", "furnished", "parkingAvailable", "smokingAllowed", "description"];


  var propertyAttributes = [ "streetNumeric", "streetAddress", "city", "state", "zip", "apt", "bldg", "latitude", "longitude", "type",
    "description", "bedrooms","bathrooms", "parkingSpots", "livingAreaSqFt", "hoaFee", "otherFee", "status" ];

  var roomListingResponse = {};

  RoomListing.find({  where: {id: req.param("id")}, attributes: roomAttributes, include:
    [ {model: Property,  attributes: propertyAttributes, as: 'relatedPropertyId'}]}).then(function(roomListing) {

    var roomDetails = roomListing.dataValues;
    var propertyDetails = roomListing.relatedPropertyId.dataValues;

    propertyDetails.coords = {};
    propertyDetails.coords.latitude =   roomListing.relatedPropertyId.dataValues.latitude;
    propertyDetails.coords.longitude =   roomListing.relatedPropertyId.dataValues.longitude;

    delete  propertyDetails.latitude;
    delete propertyDetails.longitude;


    var roomListingResponse = _.extend({}, { roomDetails: roomDetails }, { propertyDetails: propertyDetails } );

    delete roomListingResponse.roomDetails.relatedPropertyId;

   // console.log('Room Listing: ', roomListingResponse);

    res.json(roomListingResponse);
  });
};


/**
 *  Gets all room listings with room listing and property details.  Default behavior is to return fully hydrated
 *  models unless a filter is used in the query.
 *
 *  Attribute filters coming soon in order to specify only what you want in the return object
 *
 *
 *  Search criteria coming to support searching with a specific distance.  For example, if you use distance,
 *    you MUST pass in latitude and longitude:
 *
 *     lat=double in 8.3 format
 *     long=double in 8.2 format
 *     distance=whole number in miles
 *
 *     Passing in lat, long to the api supports current location using mobile, your university, your current
 *         home address, your gf/bf address, ...
 *
 *
 *
 * @param req
 * @param res   array of objects { roomDetails: roomDetails, propertyDetails: propertyDetails }
 * @param next
 */
exports.getAllRoomListings = function(req, res, next) {

  var roomAttributes = ["id", "monthlyPrice", "securityDeposit", "availableMoveIn", "leaseEndDate", "leaseType", "gender",
    "monthlyUtilityCost", "roomType", "sharedBathroom", "numRoomates", "furnished", "parkingAvailable", "smokingAllowed", "description"];


  var propertyAttributes = [ "id", "streetNumeric", "streetAddress", "city", "state", "zip", "apt", "bldg", "latitude", "longitude", "type",
   "description", "bedrooms","bathrooms", "parkingSpots", "livingAreaSqFt", "hoaFee", "otherFee", "status" ];

  var roomListingResponse = [];

  RoomListing.findAll({  attributes: roomAttributes, include: [ {model: Property,  attributes: propertyAttributes, as: 'relatedPropertyId'}],  limit:100, order: '"monthlyPrice"'}).then(function(roomListings) {

    roomListings.forEach(function(e, i, a) {
      var roomDetails = e.dataValues;
      var propertyDetails = e.relatedPropertyId.dataValues;
      propertyDetails.coords = {};
      propertyDetails.coords.latitude =   e.relatedPropertyId.dataValues.latitude;
      propertyDetails.coords.longitude =   e.relatedPropertyId.dataValues.longitude;
      delete  propertyDetails.latitude;
      delete propertyDetails.longitude;


      var mashed = _.extend({}, { roomDetails: roomDetails }, { propertyDetails: propertyDetails } );
      delete mashed.roomDetails.relatedPropertyId;

      roomListingResponse.push(mashed);
    });

   // console.log('Room Listings: ', roomListingResponse);

    res.json(roomListingResponse);
  });
};








