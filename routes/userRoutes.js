const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("user routes working");
});

// register user

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({
      user,
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log({ user, email, password });
    if (!user) {
      throw new Error("Unable to login, User not found!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login, Invalid credentials!");
    }
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET_KEY
    );
    await user.save();
    res.status(200).send({
      user,
      message: "User login successfully!",
      token,
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
