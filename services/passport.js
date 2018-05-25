const passport = require("passport");
const User = require("../models/User");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this username and password
  // call done with the user if it is correct user and password
  // otherwise call done with false
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // compare password
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});
// Setup options for JWT strategy
const jwtOptions = {
  // where to look for JWT from the request
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  // include the secretKey that we use to generate JWT
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // payload: the decrypted JWT => { userId, iat }
  // See if the user ID in the payload exists in our database,
  // If it does, call 'done' with that
  // otherwise call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
