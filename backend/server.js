import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { configDotenv } from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

configDotenv();

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected: " + conn.connection.host);
  } catch (err) {
    console.log("Error: " + err.message);
    process.exit(1);
  }
})();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

import fs from 'fs';
process.on('uncaughtException', (err) => {
  fs.appendFileSync('error.log', `Uncaught Exception: ${err.stack}\n`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync('error.log', `Unhandled Rejection: ${reason.stack || reason}\n`);
});

app.listen(PORT, () =>
  console.log("Server started at http://localhost:" + PORT),
);
