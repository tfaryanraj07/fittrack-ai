const router = require("express").Router();
const Workout = require("../models/Workout");
const jwt = require("jsonwebtoken");

// Middleware to verify token
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}

// Add workout
router.post("/", auth, async (req, res) => {
  const workout = await Workout.create({
    userId: req.user.id,
    exercise: req.body.exercise,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
    goalType: req.body.goalType,
    muscleGroup: req.body.muscleGroup, // 🔥 NEW
  });

  res.json(workout);
});


// Get user workouts
router.get("/", auth, async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.id });
  res.json(workouts);
});

// Delete workout
router.delete("/:id", auth, async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.json({ msg: "Workout deleted" });
});


module.exports = router;
