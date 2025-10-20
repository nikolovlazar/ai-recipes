import "./instrument.js";
import "dotenv/config";
import { createApp } from "./app.js";
import * as Sentry from "@sentry/node";

const app = createApp();
const port = process.env.PORT || 3001;

Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
// @ts-expect-error
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`🚀 AI Recipes API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔌 API routes: http://localhost:${port}/api`);
});
