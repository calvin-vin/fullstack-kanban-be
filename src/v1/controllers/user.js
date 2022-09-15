const User = require("../models/User");
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");
const UnauthicatedError = require("../errors/unauthicated");

const register = asyncWrapper(async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
});

const login = asyncWrapper(async (req, res) => {
  const {
    body: { username, password },
  } = req;

  const user = await User.findOne({ username }).select("username password");
  if (!user) {
    throw new UnauthicatedError("Invalid credentials");
  }

  const isPasswordCorrect = user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthicatedError("Invalid credentials");
  }

  user.password = undefined;
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
});

module.exports = {
  register,
  login,
};
