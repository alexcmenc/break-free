const mongoose = require("mongoose");

const moods = ["great", "good", "ok", "bad", "awful"];

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    at: { type: Date, default: Date.now, index: true },

    cigarretesSmoked: { type: Number, min: 0, default: 0 },
    cigarretesAvoided: { type: Number, min: 0, default: 0 },
    cravingIntensity: { type: Number, min: 0, max: 5, default: 0 },
    slip: { type: Boolean, default: false },
    mood: { type: String, enum: moods, default: "ok" },
    triggers: { type: [String], default: [] },
    note: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

logSchema.index({ user: 1, at: -1 });

const Log = mongoose.model("Log", logSchema);
module.exports = { Log, moods };
