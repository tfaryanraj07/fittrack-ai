const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Auth middleware
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

router.post("/register", register);
router.post("/login", login);

router.put("/update", auth, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  );

  res.json(updatedUser);
});

// 🔐 Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    await user.save();

    res.json({ msg: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
