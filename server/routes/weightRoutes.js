const router = require("express").Router();
const Weight = require("../models/Weight");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

router.post("/", auth, async (req, res) => {
  const weight = await Weight.create({
    userId: req.user.id,
    weight: req.body.weight,
  });

  res.json(weight);
});

router.get("/", auth, async (req, res) => {
  const weights = await Weight.find({ userId: req.user.id });
  res.json(weights);
});

module.exports = router;
