import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { env } from "./config/env";
import errorMiddleware from "./middleware/error.middleware";
import { securityHeaders } from "./middleware/securityHeaders.middleware";
import { sanitizeBody, sanitizeQuery } from "./middleware/sanitize.middleware";
import { apiRateLimiter } from "./middleware/rateLimit.middleware";

import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

// security headers — sabse pehle
app.use(securityHeaders);

// CORS — sirf allowed origin se requests aane do
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.clientUrl];

      // development mein origin undefined hoti hai (Postman, curl etc)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// body size limit — large payload attacks se bachao (10kb enough for this app)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// sabse pehle sanitize karo phir routes mein jaao
app.use(sanitizeBody);
app.use(sanitizeQuery);

// general API rate limit
app.use("/api", apiRateLimiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/ai", aiRoutes);

// health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", message: "CineVerse backend is live" });
});

// 404 handler — unknown routes ke liye
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// global error handler — always last
app.use(errorMiddleware);

// unhandled rejections aur exceptions — process crash se bachao
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[uncaughtException]", error);
  process.exit(1); // uncaught exception ke baad process ko restart karna better hai
});

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${env.port}`);
  });
};

startServer();
