import { apiClient } from "./client";
import type {
  ProductSearchResult,
  SearchProductsResponse,
  ProductDetails,
} from "@ai-recipes/shared";

/**
 * Search products by text query
 * @param query - Search term (e.g., "nutella")
 * @param page - Page number for pagination (default: 1)
 * @throws HttpError if query is invalid (400)
 */
export async function searchProducts(
  query: string,
  page: number = 1
): Promise<SearchProductsResponse> {
  if (!query || query.trim().length < 2) {
    throw new Error("Search query must be at least 2 characters");
  }

  const params = new URLSearchParams({
    q: query.trim(),
    page: page.toString(),
  });

  return apiClient.get<SearchProductsResponse>(
    `/products/search?${params.toString()}`
  );
}

/**
 * Get product details by barcode
 * @param barcode - Product barcode (EAN-13)
 * @throws HttpError if product not found (404)
 */
export async function getProduct(barcode: string): Promise<ProductDetails> {
  if (!barcode) {
    throw new Error("Barcode is required");
  }

  return apiClient.get<ProductDetails>(`/products/${barcode}`);
}
