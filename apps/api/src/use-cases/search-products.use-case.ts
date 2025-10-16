/**
 * Search Products Use Case
 *
 * Business logic for searching products by text query.
 * Pure function - no framework dependencies.
 */

import type { SearchProductsResponse } from "@ai-recipes/shared";
import type {
  IProductsRepository,
  SearchProductsDto,
} from "../types/product.types.js";

/**
 * Search for products by text query
 *
 * Business rules:
 * - Query must not be empty
 * - Query is trimmed and validated
 * - Page defaults to 1 if not provided
 *
 * @param productsRepository - Products data access layer
 * @param dto - Search parameters
 * @returns Search results with products array
 * @throws Error if query is empty or invalid
 */
export async function searchProductsUseCase(
  productsRepository: IProductsRepository,
  dto: SearchProductsDto
): Promise<SearchProductsResponse> {
  // Validate query
  const query = dto.query?.trim();

  if (!query || query.length === 0) {
    throw new Error("Search query cannot be empty");
  }

  // Validate page number
  const page = dto.page && dto.page > 0 ? dto.page : 1;

  // Delegate to repository
  return await productsRepository.searchProducts({
    query,
    page,
  });
}
