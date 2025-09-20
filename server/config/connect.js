const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected!", mongoose.connection.name);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };
