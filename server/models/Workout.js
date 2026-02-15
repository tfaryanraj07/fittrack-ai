const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  exercise: String,
  sets: Number,
  reps: Number,
  weight: Number, // for strength tracking
  goalType: String, // bulking or cutting
  muscleGroup: String, // 🔥 NEW
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workout", workoutSchema);