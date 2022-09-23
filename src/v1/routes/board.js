const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  updatePosition,
  getOne,
  update,
  updateFavouritePosition,
  getFavourites,
  deleteBoard,
} = require("../controllers/board");

router.route("/").get(getAll).post(create).put(updatePosition);
router.route("/favourites").get(getFavourites).put(updateFavouritePosition);
router.route("/:boardId").get(getOne).put(update).delete(deleteBoard);

module.exports = router;
