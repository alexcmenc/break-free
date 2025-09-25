require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/connect.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ROUTES
const logRoutes = require("./routes/log.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// mount routes
app.use("/logs", logRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// health check
app.get("/health", (_req, res) => res.json({ status: "We are Ready To Go" }));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// error handling
require("./db/error-handling.js")(app);

const PORT = process.env.PORT || 5005;
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