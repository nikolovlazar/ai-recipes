/**
 * Product Domain Types (Backend Internal)
 *
 * This file contains backend-specific types for product management.
 * API contract types are imported from @ai-recipes/shared.
 */

import type {
  SearchProductsResponse,
  ProductDetails,
} from "@ai-recipes/shared";

/**
 * DTO for search query parameters (internal use)
 */
export interface SearchProductsDto {
  query: string;
  page?: number;
}

/**
 * Repository interface for products data access
 * This defines the contract that the repository must implement
 */
export interface IProductsRepository {
  searchProducts(dto: SearchProductsDto): Promise<SearchProductsResponse>;
  getProductByBarcode(barcode: string): Promise<ProductDetails | null>;
}
