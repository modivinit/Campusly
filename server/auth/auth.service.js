'use strict';

var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../sqldb').model('rentedUser');
var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.find({
        where: {
          id: req.user.id
        }
      })
        .then(function(user) {
          if (!user) {
            return res.send(401).end();
          }
          req.user = user;
          next();
        })
        .catch(function(err) {
          return next(err);
        });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403);
      }
    });
}

//function isCurrentUser() {
//  return compose()
//    .use(isAuthenticated())
//    .use(function owner(req, res, next) {
//      console.log('user.id',req.user.id);
//      console.log('userId',req.userId);
//      if(req.user.id===req.userId){
//        next();
//      }else{
//        throw new Error('you are not owner');
//      }
//    });
//}
//
//function isOwner() {
//  return compose()
//    .use(isAuthenticated())
//    .use(isCurrentUser())
//    .use(function owner(req, res, next) {
//      console.log('user.id',req.user.id);
//      console.log('userId',req.userId);
//      if(req.user.id===req.userId){
//        next();
//      }else{
//        throw new Error('u are not owner');
//      }
//    });
//}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ id: id }, config.secrets.session, {
    expiresInMinutes: 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) {
    return res.json(404, {
      message: 'Something went wrong, please try again.'
    });
  }
  var token = signToken(req.user.id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
//exports.isOwner = isOwner;
//exports.isCurrentUser = isCurrentUser;
