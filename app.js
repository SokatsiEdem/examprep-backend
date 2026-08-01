import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/question.routes.js";
import practiceRoutes from "./routes/practice.routes.js";
import cbtRoutes from "./routes/cbt.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

// Middlewares
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

dotenv.config();

const app = express();

/**
 * ==========================
 * Global Middlewares
 * ==========================
 */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

/**
 * ==========================
 * Health Check
 * ==========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExamPrep Backend API is running.",
    version: "1.0.0",
  });
});

/**
 * ==========================
 * API Routes
 * ==========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/exams", cbtRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/analytics", analyticsRoutes);

/**
 * ==========================
 * 404 Handler
 * ==========================
 */
app.use(notFound);

/**
 * ==========================
 * Global Error Handler
 * ==========================
 */
app.use(errorHandler);

export default app;