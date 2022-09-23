const { StatusCodes } = require("http-status-codes");
const Board = require("../models/Board");
const section = require("../models/Section");
const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/async");
const NotFoundError = require("../errors/not-found");
const Section = require("../models/Section");

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
  res.status(StatusCodes.OK).json(boards);
});

const updatePosition = asyncWrapper(async (req, res) => {
  const { boards } = req.body;
  for (const key in boards.reverse()) {
    const board = boards[key];
    await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
  }
  res.status(StatusCodes.OK).json("updated");
});

const getOne = asyncWrapper(async (req, res) => {
  const { boardId } = req.params;
  const board = await Board.findOne({ user: req.user._id, _id: boardId });
  if (!board) {
    throw new NotFoundError(`Board with id: ${boardId} is not found`);
  }
  const sections = await Section.find({ board: boardId });
  for (const section of sections) {
    const tasks = await Task.find({ section: section.id })
      .populate("section")
      .sort("-position");
    section._doc.tasks = tasks;
  }
  board._doc.sections = sections;

  res.status(200).json(board);
});

const update = asyncWrapper(async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favourite } = req.body;

  if (title === "") req.body.title = "Untitled";
  if (description === "") req.body.description = "Add description here";
  const currentBoard = await Board.findById(boardId);
  if (!currentBoard)
    throw new NotFoundError(`Board with id: ${boardId} is not found`);

  if (favourite !== undefined && currentBoard.favourite !== favourite) {
    const favourites = await Board.find({
      user: currentBoard.user,
      favourite: true,
      _id: { $ne: boardId },
    }).sort("favouritePosition");
    if (favourite) {
      req.body.favouritePosition =
        favourites.length > 0 ? favourites.length : 0;
    } else {
      for (const key in favourites) {
        const element = favourites[key];
        await Board.findByIdAndUpdate(element.id, {
          $set: { favouritePosition: key },
        });
      }
    }
  }

  const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });
  res.status(StatusCodes.OK).json(board);
});

const getFavourites = asyncWrapper(async (req, res) => {
  const favourites = await Board.find({
    user: req.user._id,
    favourite: true,
  }).sort("-favouritePosition");
  res.status(StatusCodes.OK).json(favourites);
});

const updateFavouritePosition = asyncWrapper(async (req, res) => {
  const { boards } = req.body;
  for (const key in boards.reverse()) {
    const board = boards[key];
    await Board.findByIdAndUpdate(board.id, {
      $set: { favouritePosition: key },
    });
  }
  res.status(StatusCodes.OK).json("updated");
});

const deleteBoard = asyncWrapper(async (req, res) => {
  const { boardId } = req.params;

  const sections = await Section.find({ board: boardId });
  for (const section of sections) {
    await Task.deleteMany({ section: section.id });
  }
  await Section.deleteMany({ board: boardId });

  const currentBoard = await Board.findById(boardId);
  if (currentBoard.favourite) {
    const favourites = await Board.find({
      user: currentBoard.user,
      favourite: true,
      _id: { $ne: boardId },
    }).sort("favouritePosition");

    for (const key in favourites) {
      const element = favourites[key];
      await Board.findByIdAndUpdate(element.id, {
        $set: { favouritePosition: key },
      });
    }
  }

  await Board.deleteOne({ _id: boardId });

  const boards = await Board.find().sort("position");
  for (const key in boards) {
    const board = boards[key];
    await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
  }

  res.status(StatusCodes.OK).json("deleted");
});

module.exports = {
  create,
  getAll,
  updatePosition,
  getOne,
  update,
  getFavourites,
  updateFavouritePosition,
  deleteBoard,
};
