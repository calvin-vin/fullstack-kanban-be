const jwt = require("jsonwebtoken");
const UnauthicatedError = require("../errors/unauthicated");
const User = require("../models/User");

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthicatedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) {
      throw new UnauthicatedError("No authorized to access this route");
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticationMiddleware;
