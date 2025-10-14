/**
 * Analysis Domain Types
 *
 * Types for product analysis feature that combines:
 * - User profile data
 * - Product details
 * - AI-generated analysis and recommendations
 */

import type { ProfileResponse } from "./profile.types.js";
import type { ProductDetails } from "./product.types.js";

/**
 * Analysis request context
 * Contains all data needed for AI analysis
 */
export interface AnalysisContext {
  profile: ProfileResponse;
  product: ProductDetails;
}

/**
 * Recipe recommendation
 */
export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

/**
 * Analysis result from AI
 */
export interface AnalysisResponse {
  isSafe: boolean;
  issues?: string[];
  recommendation: string;
  recipe?: Recipe;
}

/**
 * Repository interface for analysis operations
 */
export interface IAnalysisRepository {
  analyzeProduct(context: AnalysisContext): Promise<AnalysisResponse>;
}
