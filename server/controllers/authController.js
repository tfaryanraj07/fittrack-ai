
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, height, weight, goal } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const calories = 10 * weight + 6.25 * height - 5 * 20 + 5;

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    height,
    weight,
    goal,
    calories
  });

  res.json(user);
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    height: user.height,
    weight: user.weight,
    goal: user.goal,
    calories: user.calories
  }
});


  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

