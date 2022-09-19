const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./model-options");

const SectionSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Section", SectionSchema);
