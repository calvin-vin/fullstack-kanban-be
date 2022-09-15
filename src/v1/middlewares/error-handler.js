const { StatusCodes } = require("http-status-codes");
const UnauthicatedError = require("../errors/unauthicated");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof UnauthicatedError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
};

module.exports = errorHandlerMiddleware;
