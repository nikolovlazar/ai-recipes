import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger.middleware.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import routes from "./routes/index.js";

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(logger);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
