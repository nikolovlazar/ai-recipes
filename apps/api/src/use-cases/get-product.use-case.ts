/**
 * Get Product Use Case
 *
 * Business logic for retrieving product details by barcode.
 * Pure function - no framework dependencies.
 */

import type {
  IProductsRepository,
  ProductDetails,
} from "../types/product.types.js";

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
  barcode: string
): Promise<ProductDetails | null> {
  // Validate barcode
  const cleanBarcode = barcode?.trim();

  if (!cleanBarcode || cleanBarcode.length === 0) {
    throw new Error("Barcode cannot be empty");
  }

  // Basic barcode format validation (alphanumeric)
  if (!/^[a-zA-Z0-9]+$/.test(cleanBarcode)) {
    throw new Error("Invalid barcode format");
  }

  // Delegate to repository
  return await productsRepository.getProductByBarcode(cleanBarcode);
}
