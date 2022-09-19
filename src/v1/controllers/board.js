const { StatusCodes } = require("http-status-codes");
const Board = require("../models/Board");
const section = require("../models/Section");
const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/async");

const create = asyncWrapper(async (req, res) => {
  const boardsCount = await Board.find().count();
  const board = await Board.create({
    user: req.user._id,
    position: boardsCount > 0 ? boardsCount : 0,
  });
  res.status(StatusCodes.CREATED).json(board);
});

const getAll = asyncWrapper(async (req, res) => {
  const boards = await Board.find({ user: req.user._id }).sort("-position");
  res.status(StatusCodes.OK).json({ boards });
});

module.exports = {
  create,
  getAll,
};
