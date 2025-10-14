/**
 * Product Domain Types and DTOs
 *
 * These types define the contract between layers for product operations:
 * - DTOs for API requests/responses
 * - Domain models for business logic
 * - Repository interface
 */

/**
 * Simplified product information for search results
 */
export interface ProductSearchResult {
  barcode: string;
  name: string;
  brands?: string[];
  image_url?: string;
  nutriscore_grade?: string;
}

/**
 * Full product details with nutritional information
 */
export interface ProductDetails {
  barcode: string;
  name: string;
  brands?: string | string[]; // Can be string (from OFF API) or array (from SearchApi)
  categories?: string;
  categories_tags?: string[];
  image_url?: string;
  ingredients_text?: string;
  ingredients?: any[]; // Full ingredient breakdown with percent
  allergens?: string;
  allergens_tags?: string[];
  traces?: string;
  traces_tags?: string[];
  nutriscore_grade?: string;
  nova_group?: number; // 1-4: food processing level
  ecoscore_grade?: string; // a-e: environmental score
  nutrient_levels?: {
    fat?: string; // "low" | "moderate" | "high"
    salt?: string;
    "saturated-fat"?: string;
    sugars?: string;
  };
  nutriments?: {
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
    [key: string]: number | undefined; // Allow other nutriments
  };
  quantity?: string;
  serving_size?: string;
  cached?: boolean;
  cached_at?: Date;
}

/**
 * DTO for search query parameters
 */
export interface SearchProductsDto {
  query: string;
  page?: number;
}

/**
 * Search results response
 */
export interface SearchProductsResponse {
  products: ProductSearchResult[];
  count: number;
  page: number;
}

/**
 * Repository interface for products data access
 * This defines the contract that the repository must implement
 */
export interface IProductsRepository {
  searchProducts(dto: SearchProductsDto): Promise<SearchProductsResponse>;
  getProductByBarcode(barcode: string): Promise<ProductDetails | null>;
}
