const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  weight: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Weight", weightSchema);
