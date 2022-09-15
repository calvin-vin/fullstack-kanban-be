const mongoose = require("mongoose");

exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
