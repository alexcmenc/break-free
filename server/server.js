const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${env}` });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/connect.js");

// Routes
const logRoutes = require("./routes/log.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");

const app = express();

app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/api/logs", logRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.send("Hello World!"));

// Centralized error handling
require("./db/error-handling.js")(app);

// Start
const PORT = process.env.PORT || 5005;
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`✅ API ready on port ${PORT} (env: ${env})`)
    );
  })
  .catch((err) => {
    console.error("Server start failed:", err);
    process.exit(1);
  });
