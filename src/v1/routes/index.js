var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/boards", require("./board"));

module.exports = router;
