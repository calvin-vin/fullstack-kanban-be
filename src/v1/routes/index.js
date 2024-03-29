var express = require("express");
var router = express.Router();
const authenticationMiddleware = require("../middlewares/auth");

router.use("/auth", require("./auth"));
router.use("/boards", authenticationMiddleware, require("./board"));
router.use(
  "/boards/:boardId/sections",
  authenticationMiddleware,
  require("./section")
);
router.use(
  "/boards/:boardId/tasks",
  authenticationMiddleware,
  require("./task")
);

module.exports = router;
