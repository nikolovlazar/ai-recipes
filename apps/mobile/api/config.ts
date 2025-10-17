export const API_CONFIG = {
  // Base URL - use localhost for development
  baseURL: __DEV__
    ? "http://localhost:3001/api" // iOS Simulator
    : "https://api.airecipes.com/api", // Production (not configured yet)

  // For Android emulator, use: "http://10.0.2.2:3001/api"

  // Timeouts
  timeout: 10000, // 10 seconds default
  longTimeout: 30000, // 30 seconds for long operations

  // Headers
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const getAPIBaseURL = (): string => {
  return API_CONFIG.baseURL;
};
