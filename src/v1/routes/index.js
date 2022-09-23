var express = require("express");
var router = express.Router();
const authenticationMiddleware = require("../middlewares/auth");

router.use("/auth", require("./auth"));
router.use("/boards", authenticationMiddleware, require("./board"));

module.exports = router;
