import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5005;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
  });
});
