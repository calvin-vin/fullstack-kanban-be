const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./model-options");

const TaskSchema = new Schema(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Task", TaskSchema);
