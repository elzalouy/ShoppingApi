const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 256,
    unique: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  oldPassword: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, required: true },
  adminAt: { type: Date },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      phone: this.phone,
    },
    config.get("jwt_PK"),
    {
      expiresIn: "30d",
    }
  );
  return token;
};

userSchema.methods.ResetPasswordToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, action: "reset" },
    config.get("jwt_PK"),
    { expiresIn: "1h" }
  );
  return token;
};
const User = mongoose.model("user", userSchema);

function verifyToken(token) {
  return jwt.verify(token, config.get("jwt_PK"));
}

function validateRegister(newUser) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(newUser);
}

function authUser(user) {
  const schema = {
    email: Joi.string().email().required().max(255),
    password: Joi.string().min(5).max(255).required(),
  };
  const authSchema = Joi.object(schema);
  return authSchema.validate(user);
}

function validateChangePassword(data) {
  const schema = {
    oldPassword: Joi.string().min(6).max(64).required(),
    newPassword: Joi.string().min(6).max(64).required(),
  };
  const passSchema = Joi.object(schema);
  return passSchema.validate(data);
}

function validateForgotPassword(data) {
  const schema = {
    newPassword: Joi.string().min(6).max(1024).required(),
    token: Joi.string().required(),
  };
  return Joi.validate(data, schema);
}

module.exports = {
  User,
  authUser,
  validateChangePassword,
  validateForgotPassword,
  verifyToken,
  validateRegister,
};
