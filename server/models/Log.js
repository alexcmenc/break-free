// models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    at: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    mood: { type: String, default: null },
    slip: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
module.exports = { Log };
