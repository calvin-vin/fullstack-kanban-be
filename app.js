const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const errorHandlerMiddleware = require("./src/v1/middlewares/error-handler");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", require("./src/v1/routes"));

app.use(errorHandlerMiddleware);

module.exports = app;
