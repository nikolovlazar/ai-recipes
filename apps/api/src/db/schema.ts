import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * User profile table (single tenant)
 * Stores anonymous nutrition-related information for one user
 */
export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  diet: text("diet"), // e.g., "vegan", "vegetarian", "keto", "paleo"
  allergies: text("allergies"), // JSON array: ["nuts", "dairy", "gluten"]
  restrictions: text("restrictions"), // JSON array: ["low-sodium", "low-sugar"]
  age: integer("age"),
  weight: real("weight"), // in kg
  goals: text("goals"), // e.g., "lose weight", "build muscle", "maintain health"
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/**
 * Products cache table
 * Stores product data from Open Food Facts to prevent rate limiting
 * Cache invalidates after 7 days
 */
export const productsTable = sqliteTable("products", {
  barcode: text("barcode").primaryKey(),
  name: text("name").notNull(),
  data: text("data").notNull(), // Full JSON data from Open Food Facts
  cachedAt: integer("cached_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports for use in application code
export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
