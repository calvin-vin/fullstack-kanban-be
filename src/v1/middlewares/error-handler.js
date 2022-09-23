const { StatusCodes } = require("http-status-codes");
const NotFoundError = require("../errors/not-found");
const UnauthicatedError = require("../errors/unauthicated");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof UnauthicatedError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } else if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } else if (err.name === "CastError") {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `id: ${err.value} is not found` });
  } else if (err.name === "TokenExpiredError") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "token is expired" });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
};

module.exports = errorHandlerMiddleware;
