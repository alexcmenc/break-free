require("dotenv").config();
// const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./db/error-handling.js");
const { connectDB } = require("./config/connect.js");
const {authrequired} = require("./middleware/jwt.middleware.js");
// const logRoutes = require("./routes/logRoutes.js");
const authRoutes = require("./routes/auth.routes.js");
// const milestoneRoutes = require("./routes/milestoneRoutes.js");
// const userRoutes = require("./routes/userRoutes.js");
const app = express();

//middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//mount routes
// app.use("/api/logs",logRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/users", milestoneRoutes);
// app.use("/api/users", userRoutes);


app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/", (_req, res) => {
  res.send("Hello World!")
});

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ API ready on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Server start failed:", err);
    process.exit(1);
  });
