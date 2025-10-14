import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 AI Recipes API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔌 API routes: http://localhost:${port}/api`);
});
