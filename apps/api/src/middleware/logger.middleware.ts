import morgan from "morgan";

// Custom Morgan format for better readability
export const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    skip: (req, res) => {
      // Skip logging health check endpoints if needed
      return req.url === "/health";
    }
  }
);
