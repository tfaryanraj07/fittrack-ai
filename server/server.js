const weightRoutes = require("./routes/weightRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/workouts", workoutRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.use("/api/weight", weightRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
