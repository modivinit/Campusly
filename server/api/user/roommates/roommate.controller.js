
'use strict';

var _ = require('lodash');
var sqldb = require('../../../sqldb');
var User = sqldb.model('rented.rentedUser');
var Roommate = sqldb.model('rented.roommate');
var passport = require('passport');
var config = require('../../../config/environment');
var jwt = require('jsonwebtoken');


var validationError = function(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    console.log(err);
    res.json(statusCode, err);
  };
};

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}
function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.send(statusCode);
  };
}

exports.newRoommate = function(req, res, next) {
  if(req.body.id === req.user.id) res.send(500);
  req.body.userId = req.user.id;
  req.body.createdAt = new Date();
  req.body.fromDate = new Date();
  req.body.roommateId = req.body.id;
  req.body.id = null;
  var newRoommate = Roommate.build(req.body);
  newRoommate.save()
    .then(function(room) {
      res.json(room);
    })
    .catch(validationError(res));
};


exports.showRoommates= function(req, res, next) {
  Roommate.findAll({where:{userId:req.user.id}, include: [{ model: User, as: 'relatedRoommateId' }] }).then(function(roommates) {
    res.json(roommates);
  })

};




exports.deleteRoommate= function(req, res, next) {
  Roommate.destroy({where: { id: req.params.id }})
    .then(respondWith(res, 204))
    .catch(handleError(res));
};

exports.getRoommate= function(req, res, next) {
  Roommate.find({where: { id: req.params.id }})
    .then(function (room) {
      res.json(room);
    })
    .catch(handleError(res));
};

exports.saveRoommate= function(req, res, next) {
  Roommate.find({where: { id: req.params.id }})
    .then(function (room) {
      var updated = _.merge(room, req.body);
      updated.save().then(function (upd) {
        res.json(upd);
      })
    })
    .catch(handleError(res));
};

exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
