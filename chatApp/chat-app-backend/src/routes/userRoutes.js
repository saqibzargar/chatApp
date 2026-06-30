const express = require("express");
const User = require("../models/User");

const router = express.Router();


router.get("/search", async (req, res) => {
  const { username } = req.query;

  const users = await User.find({
    username: {
      $regex: username,
      $options: "i",
    },
  }).select("-password");

  res.json(users);
});

//--------------------------------

module.exports = router;