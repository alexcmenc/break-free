const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {authRequired} = require("../middleware/jwt.middleware.js");

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, addictionType, quitDate } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      username,
      email,
      passwordHash,
      addictionType,
      quitDate,
    });

    res.status(201).json({
      message: "User created",
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      addictionType: newUser.addictionType,
      quitDate: newUser.quitDate,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const payload = { sub: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      addictionType: user.addictionType,
      quitDate: user.quitDate,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/verify (protected)
router.get("/verify", authRequired, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    userId: req.user.id,
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
