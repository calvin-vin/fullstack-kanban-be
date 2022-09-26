const Task = require("../models/Task");
const Section = require("../models/Section");
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");

const create = asyncWrapper(async (req, res) => {
  const { sectionId } = req.body;
  console.log(sectionId);
  const section = await Section.findById(sectionId);
  const tasksCount = await Task.find({ section: sectionId }).count();
  const task = await Task.create({
    section: sectionId,
    position: tasksCount > 0 ? tasksCount : 0,
  });
  task._doc.section = section;
  res.status(StatusCodes.OK).json(task);
});

const update = asyncWrapper(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
  res.status(StatusCodes.OK).json(task);
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { taskId } = req.params;
  const currentTask = await Task.find({ _id: taskId });
  await Task.deleteOne({ _id: taskId });
  const tasks = await Task.find({ section: currentTask.section }).sort(
    "position"
  );
  for (const key in tasks) {
    await Task.findByIdAndUpdate(tasks[key].id, { $set: { position: key } });
  }
  res.status(StatusCodes.OK).json("deleted");
});

const updatePosition = asyncWrapper(async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;

  const resourceListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();

  if (resourceSectionId !== destinationSectionId) {
    for (const key in resourceListReverse) {
      await Task.findByIdAndUpdate(resourceListReverse[key].id, {
        $set: {
          section: resourceSectionId,
          position: key,
        },
      });
    }
  }
  for (const key in destinationListReverse) {
    await Task.findByIdAndUpdate(destinationListReverse[key].id, {
      $set: {
        section: destinationSectionId,
        position: key,
      },
    });
  }

  res.status(StatusCodes.OK).json("updated");
});

module.exports = {
  create,
  update,
  deleteTask,
  updatePosition,
};
