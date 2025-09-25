const bcrypt = require("bcryptjs");
const { User, addictionTypes } = require("../models/User");

//tiny helper: softly parse a date String

function parseDate(value) {
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

//GET

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        addictionType: user.addictionType,
        quitDate: user.quitDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

//patch (update {username, email, addictiontype, quitdate})

exports.updateMe = async (req, res, next) => {
  try {
    const updates = {};

    if (typeof req.body.username !== "undefined") updates.username = req.body.username;
    if(typeof req.body.email !== "undefined") updates.email = req.body.email;
    if (typeof req.body.addictionType !== "undefined") updates.addictionType = req.body.addictionType;
    if(typeof req.body.quitDate !== "undefined") {
      const d = parseDate(req.body.quitDate);
      if (d) updates.quitDate = d;
    };

    if (updates.email) {
      const exists = await User.findOne({email: updates.email, _id: {$ne: req.user.id}});
      if (exists) return res.status(400).json({error: "Email already in use"});
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      {$set: updates},
      {new: true, runValidators: true}
    )

    if (!user) return res.status(404).json({error: "User not found"});

    res.json({
      user: {
        id: user._id,
        username: user.username, 
        email: user.email, 
        addictionType: user.addictionType, 
        quitDate: user.quitDate, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt
      },
    }
    )
  } catch (error) {
    next(error)
  };
  
}
exports.changePassword = async (req, res, next) => {
  try {
    const {currentPassword, newPassword} = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({error: "All fields are required"});
    }

    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({error: "User not found"});

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if(!ok) return res.status(400).json({error: "Please insert a valid password."});

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({message: "Password was successfully changed"});


  } catch (error) {
    next(error);
  }
}