/**
 * Gather Analysis Context Use Case
 *
 * Business logic for gathering data needed for product analysis.
 * Pure function - no framework dependencies.
 */

import type { IProfileRepository } from "../types/profile.types.js";
import type { IProductsRepository } from "../types/product.types.js";
import type { AnalysisContext } from "../types/analysis.types.js";
import * as Sentry from "@sentry/node";

/**
 * Gather data for product analysis
 *
 * Business rules:
 * - Product must exist
 * - User profile must exist (user must onboard first)
 * - Returns context with both profile and product data
 *
 * @param profileRepository - Profile data access layer
 * @param productsRepository - Products data access layer
 * @param barcode - Product barcode to analyze
 * @returns AnalysisContext with profile and product data
 * @throws Error if profile or product not found
 */
export async function gatherAnalysisContextUseCase(
  profileRepository: IProfileRepository,
  productsRepository: IProductsRepository,
  barcode: string,
): Promise<AnalysisContext> {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "Gather Analysis Context",
      attributes: {
        "product.barcode": barcode,
      },
    },
    async () => {
      const profile = await profileRepository.findProfile();

      if (!profile) {
        throw new Error(
          "Profile not found. Please complete onboarding before analyzing products.",
        );
      }

      const product = await productsRepository.getProductByBarcode(barcode);

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        profile,
        product,
      };
    },
  );
}
