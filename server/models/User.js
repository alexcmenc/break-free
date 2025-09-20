const mongoose = require("mongoose");

const User = mongoose.model("User", userSchema);
const addictionTypes = ["smoking", "drinking", "vaping", "sugar", "food"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    quitDate: { type: Date, default: null },
    addictionType: { type: String, enum: addictionTypes, default: "smoking" },
  },
  { timestamps: true }
);

module.exports(User, addictionTypes);


