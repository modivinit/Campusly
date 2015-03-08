var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.find({where: {
      'facebookOAuthId': profile.id
    }})
      .then(function(user) {
        //add this to expression  "&& profile.emails[0].value.match(/\.edu$/)" to restrict other mails signup
        if (!user && profile.emails[0].value.match(/\.edu$/)) {
          user = User.build({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            middlename: profile.name.middleName,
            password:'password',
            runIdentityCheck:false,
            shareCreditReport:false,
            createdAt: new Date(),
            email: profile.emails[0].value,
            role: 'user',
            username:  profile.displayName,
            provider: 'facebook',
            facebookOAuthId:profile.id,
            confirmedEmail:false,
            salt:'temporary'
          });
          delete user.dataValues.id;
          console.log('ovo je user', user);
          user.save()
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        } else {
          return done(null, user);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }));
};
