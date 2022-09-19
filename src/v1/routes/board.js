const express = require("express");
const router = express.Router();
const { create, getAll } = require("../controllers/board");
const authenticationMiddleware = require("../middlewares/auth");

router.route("/", authenticationMiddleware).get(getAll).post(create);

module.exports = router;
