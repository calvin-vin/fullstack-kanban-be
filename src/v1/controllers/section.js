const Section = require("../models/Section");
const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");

const create = asyncWrapper(async (req, res) => {
  const { boardId } = req.params;
  const section = await Section.create({ board: boardId });
  section._doc.tasks = [];
  res.status(StatusCodes.OK).json(section);
});

const update = asyncWrapper(async (req, res) => {
  const { sectionId } = req.params;
  const section = await Section.findByIdAndUpdate(sectionId, {
    $set: req.body,
  });
  section._doc.tasks = [];
  res.status(StatusCodes.OK).json(section);
});

const deleteSection = asyncWrapper(async (req, res) => {
  const { sectionId } = req.params;
  await Task.deleteMany({ section: sectionId });
  await Section.deleteOne({ _id: sectionId });
  res.status(StatusCodes.OK).json("deleted");
});

module.exports = {
  create,
  update,
  deleteSection,
};
