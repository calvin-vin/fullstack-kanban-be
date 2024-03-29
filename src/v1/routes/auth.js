const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const { login, register } = require("../controllers/user");
const authenticationMiddleware = require("../middlewares/auth");
const validateHandler = require("../middlewares/validation-handler");
const User = require("../models/User");

router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("username must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be at least 8 characters"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("username already exists");
      }
    });
  }),
  validateHandler,
  register
);

router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("username must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
  validateHandler,
  login
);

router.post("/verify-token", authenticationMiddleware, (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

module.exports = router;
