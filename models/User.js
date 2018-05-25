const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre("save", function(next) {
  const user = this; // instance of User

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // encrypt our password using the salt``
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      // overwrite plain text password with the encrypted
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

const UserClass = mongoose.model("User", userSchema);

module.exports = UserClass;
