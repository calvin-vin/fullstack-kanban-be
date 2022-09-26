const express = require("express");
const router = express.Router({ mergeParams: true });
const { create, update, deleteSection } = require("../controllers/section");

router.route("/").post(create);
router.route("/:sectionId").put(update).delete(deleteSection);

module.exports = router;
