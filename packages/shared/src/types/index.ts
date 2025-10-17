/**
 * Shared types for AI Recipes - API Contract
 *
 * These types define the contract between the API and mobile app.
 * They represent what the API actually returns, not the raw data sources.
 *
 * Note: open-food-facts.ts contains raw Open Food Facts types used internally
 * by the backend. Mobile app should only use types from this file.
 */

// ============================================================================
// Profile Types
// ============================================================================

/**
 * DTO for creating or updating a profile
 * Used for both POST and PUT request bodies
 */
export interface ProfileDto {
  diet?: string;
  allergies?: string[];
  restrictions?: string[];
  age?: number;
  weight?: number;
  goals?: string;
}

/**
 * Profile response returned by the API
 * Dates are serialized to ISO 8601 strings automatically by JSON.stringify
 */
export interface ProfileResponse extends ProfileDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Product Types
// ============================================================================

/**
 * Simplified product for search results
 */
export interface ProductSearchResult {
  barcode: string;
  name: string;
  brands?: string[];
  image_url?: string;
  nutriscore_grade?: string;
  countries_tags?: string[]; // Country codes (e.g., ["en:united-states", "en:canada"])
}

export interface SearchProductsResponse {
  products: ProductSearchResult[];
  count: number;
  page: number;
}

/**
 * Ingredient information in product details
 */
export interface ProductIngredient {
  id?: string;
  text?: string;
  percent?: number;
  percent_estimate?: number;
  vegan?: string;
  vegetarian?: string;
}

/**
 * Nutrient levels classification
 */
export interface NutrientLevels {
  fat?: "low" | "moderate" | "high";
  salt?: "low" | "moderate" | "high";
  "saturated-fat"?: "low" | "moderate" | "high";
  sugars?: "low" | "moderate" | "high";
}

/**
 * Nutritional information per 100g
 */
export interface NutritionPer100g {
  "energy-kcal_100g"?: number;
  "energy-kj_100g"?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
  [key: string]: number | undefined;
}

/**
 * Complete product details returned by API
 * Dates are serialized to ISO 8601 strings automatically by JSON.stringify
 */
export interface ProductDetails {
  barcode: string;
  name: string;
  brands?: string | string[];
  categories?: string;
  categories_tags?: string[];
  image_url?: string;
  ingredients_text?: string;
  ingredients?: ProductIngredient[];
  allergens?: string;
  allergens_tags?: string[];
  traces?: string;
  traces_tags?: string[];
  nutriscore_grade?: string; // a-e (a=best, e=worst)
  nova_group?: number; // 1-4 (1=unprocessed, 4=ultra-processed)
  ecoscore_grade?: string; // a-e (environmental score)
  nutrient_levels?: NutrientLevels;
  nutriments?: NutritionPer100g;
  quantity?: string;
  serving_size?: string;
  cached?: boolean;
  cached_at?: Date;
}

// ============================================================================
// Analysis Types
// ============================================================================

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export interface AnalysisResponse {
  isSafe: boolean;
  issues?: string[];
  recommendation: string;
  recipe?: Recipe;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  error: {
    message: string;
  };
}
