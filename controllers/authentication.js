const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd
  // we just need to give them a token
  // when passport-local confirms the user, it puts returned user into req.user
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email and a password" });
  }

  // See if a user with the given email exists
  User.findOne({ email, password }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
  });

  // If a user with email does NOT exist, create and save record
  const user = new User({ email, password });

  user.save(err => {
    if (err) {
      return next(err);
    }

    // Respond to request indicating the user was created
    res.json({ token: tokenForUser(user) });
  });
};
