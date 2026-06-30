const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({
    email,
  });

  if (exists)
    return res.status(400).json({
      message: "Email already exists",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.json(user);
});

//---------------------------------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user)
    return res.status(400).json({
      message: "User not found",
    });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return res.status(400).json({
      message: "Wrong password",
    });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.json({
    token,
    user,
  });
});

// -----

router.get("/getAllUsers", authMiddleware, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = router;
