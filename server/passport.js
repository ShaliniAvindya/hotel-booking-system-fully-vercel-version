const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          password: null,
        });
      }
      done(null, user);
    } catch (err) {
      console.error('Google login error:', err);
      done(err, null);
    }
  }));
} else {
  console.warn('Google OAuth not configured.');
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/users/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          password: null,
        });
      }
      done(null, user);
    } catch (err) {
      console.error('Facebook login error:', err);
      done(err, null);
    }
  }));
} else {
  console.warn('Facebook OAuth not configured.');
}

// Session serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
