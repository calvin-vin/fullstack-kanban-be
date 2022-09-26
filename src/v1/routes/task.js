const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  create,
  update,
  deleteTask,
  updatePosition,
} = require("../controllers/task");

router.route("/").post(create);
router.route("/update-position").put(updatePosition);
router.route("/:taskId").put(update).delete(deleteTask);

module.exports = router;
