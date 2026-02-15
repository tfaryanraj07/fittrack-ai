
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  height: Number,
  weight: Number,
  goal: String,
  calories: Number,
  age: Number,

});

module.exports = mongoose.model("User", userSchema);
