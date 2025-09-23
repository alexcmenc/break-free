const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

// helper: set an httpOnly cookie named "token"
function sendTokenCookie(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: "7d",
    subject: String(userId),
    algorithm: "HS256",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, addictionType, quitDate } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      passwordHash,
      addictionType,
      quitDate,
    });

    // optional auto-login
    sendTokenCookie(res, user._id);

    res.status(201).json({
      message: "User created",
      userId: user._id,
      username: user.username,
      email: user.email,
      addictionType: user.addictionType,
      quitDate: user.quitDate,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(401).json({ error: "Invalid email or password" });

    sendTokenCookie(res, user._id);

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      email: user.email,
      addictionType: user.addictionType,
      quitDate: user.quitDate,
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = (req, res) => {
  // authRequired middleware should set req.user.id
  res.status(200).json({ message: "Token is valid", userId: req.user.id });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
