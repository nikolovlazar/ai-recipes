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
import * as Sentry from "@sentry/node";

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
  dto: SearchProductsDto,
): Promise<SearchProductsResponse> {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "SearchProductsUseCase: Search Products",
      attributes: {
        "search.query": dto.query?.trim(),
        "search.page": dto.page || 1,
      },
    },
    async () => {
      const query = dto.query?.trim();

      if (!query || query.length === 0) {
        throw new Error("Search query cannot be empty");
      }

      const page = dto.page && dto.page > 0 ? dto.page : 1;

      return await productsRepository.searchProducts({
        query,
        page,
      });
    },
  );
}
