/**
 * Get Product Use Case
 *
 * Business logic for retrieving product details by barcode.
 * Pure function - no framework dependencies.
 */

import type { ProductDetails } from "@ai-recipes/shared";
import type { IProductsRepository } from "../types/product.types.js";
import * as Sentry from "@sentry/node";

/**
 * Get product details by barcode
 *
 * Business rules:
 * - Barcode must be provided and non-empty
 * - Barcode is trimmed and validated
 *
 * @param productsRepository - Products data access layer
 * @param barcode - Product barcode
 * @returns Product details or null if not found
 * @throws Error if barcode is invalid
 */
export async function getProductUseCase(
  productsRepository: IProductsRepository,
  barcode: string,
): Promise<ProductDetails | null> {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "Get Product Details",
      attributes: {
        "product.barcode": barcode?.trim(),
      },
    },
    async () => {
      const cleanBarcode = barcode?.trim();

      if (!cleanBarcode || cleanBarcode.length === 0) {
        throw new Error("Barcode cannot be empty");
      }

      if (!/^[a-zA-Z0-9]+$/.test(cleanBarcode)) {
        throw new Error("Invalid barcode format");
      }

      return await productsRepository.getProductByBarcode(cleanBarcode);
    },
  );
}
