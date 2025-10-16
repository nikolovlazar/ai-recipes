/**
 * Analysis Domain Types (Backend Internal)
 *
 * This file contains backend-specific types for product analysis.
 * API contract types are imported from @ai-recipes/shared.
 */

import type {
  AnalysisResponse,
  ProfileResponse,
  ProductDetails,
} from "@ai-recipes/shared";

/**
 * Analysis request context (internal use)
 * Contains all data needed for AI analysis
 */
export interface AnalysisContext {
  profile: ProfileResponse;
  product: ProductDetails;
}

/**
 * Repository interface for analysis operations
 */
export interface IAnalysisRepository {
  analyzeProduct(context: AnalysisContext): Promise<AnalysisResponse>;
}
