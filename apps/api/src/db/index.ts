import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

if (!process.env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

/**
 * Database instance
 * Uses LibSQL client with Drizzle ORM for type-safe queries
 */
export const db = drizzle(process.env.DB_FILE_NAME, { schema });

// Re-export schema for convenience
export { schema };
export * from "./schema.js";
