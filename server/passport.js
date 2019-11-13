const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('../config');
const { retrieveUserById, createUser } = require('./models');

const setUpPassport = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    retrieveUserById(id)
      .then(result => {
        done(null, { id: id });
      })
      .catch(error => {
        done(error);
      })
  });

  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
    function (accessToken, refreshToken, profile, done) {
      retrieveUserById(profile.id)
        .then(result => {
          if (!result.length) {
            createUser({
              fb_id: profile.id,
              fb_access_token: accessToken,
              username: profile.displayName
            })
              .then(result => {
                done(null, result.rows[0])
              })
              .catch(error => done(error));
          } else {
            done(null, result[0]);
          }
        })
        .catch(error => {
          done(error);
        });
    }
  ));
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
};

module.exports = { setUpPassport, isLoggedIn };