/**
 * Analyze Product Use Case
 *
 * Business logic for analyzing a product using AI.
 * Uses Claude Sonnet via Anthropic AI SDK with streaming.
 * Pure function - no framework dependencies.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import type { AnalysisContext } from "../types/analysis.types.js";
import * as Sentry from "@sentry/node";

/**
 * Analyze a product using AI with streaming
 *
 * Business rules:
 * - Takes analysis context (profile + product data)
 * - Uses Claude Sonnet to analyze product against user profile
 * - Returns a stream of AI-generated analysis
 *
 * @param context - Analysis context with profile and product data
 * @param abortSignal - Optional AbortSignal to cancel the request
 * @returns StreamTextResult with the AI-generated stream
 * @throws Error if AI generation fails
 */
export async function analyzeProductUseCase(
  context: AnalysisContext,
  abortSignal?: AbortSignal,
) {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "Analyze Product with AI",
      attributes: {
        "product.barcode": context.product.barcode,
        "profile.has_allergies": !!context.profile.allergies?.length,
        "profile.has_restrictions": !!context.profile.restrictions?.length,
      },
    },
    async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY environment variable is not set");
      }

      const prompt = `
    You are a professional nutritionist. Analyze the product and the user profile, and figure out if the user can or cannot consume the product. Take into account their diet, allergies, and other preferences. If they cannot, generate a detailed recipe for a healthier alternative that the user can make at home. Your response should be as short as possible, and as clear as possible. Don't output markdown, just plain text. Refer to the user in second person.

    User Profile:
    ${JSON.stringify(context.profile, null, 2)}

    Product:
    ${JSON.stringify(context.product, null, 2)}

    [Add your detailed analysis instructions here]
  `;

      const result = streamText({
        model: anthropic("claude-sonnet-4-5-20250929"),
        prompt,
        abortSignal,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      });

      return result;
    },
  );
}
