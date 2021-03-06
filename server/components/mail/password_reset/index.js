'use strict';

var mandrill = require('../../mail/mail.service');
var config = require('../../../config/environment');

var sendMail = function(user, passwordResetToken, callback){
  var locals = {};
  if(config.env=='development') {
     locals = {
      name: user.firstname,
      COMPANY: 'Campusly',
      PWDRESET_URL: 'http://' + (config.ip || 'localhost:9000') + '/loginPwdReset/',
      PWDRESETTOKEN: passwordResetToken
    };
  }
  if(config.env=='production') {
     locals = {
      name: user.firstname,
      COMPANY: 'Campusly',
      PWDRESET_URL: 'https://' + (config.ip || 'campusly.org') + '/loginPwdReset/',
      PWDRESETTOKEN: passwordResetToken
    };
  }

  mandrill.passwordReset('password_reset', user, 'Campusly - Reset Password', locals, callback);
};


exports.sendMail = sendMail;
