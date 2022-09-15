const mongoose = require("mongoose");
const { schemaOptions } = require("./model-options");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  schemaOptions
);

// encrypt password before saving it to collection
UserSchema.pre("save", function () {
  this.password = CryptoJS.AES.encrypt(
    this.password,
    process.env.PASSWORD_SECRET_KEY
  );
});

// create jwt
UserSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// compare password
UserSchema.methods.comparePassword = function (candidatePassword) {
  const decryptedPass = CryptoJS.AES.decrypt(
    this.password,
    process.env.PASSWORD_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  const isMatch = decryptedPass === candidatePassword;
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
