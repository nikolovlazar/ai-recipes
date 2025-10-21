/**
 * Get Profile Use Case
 *
 * Business logic for retrieving the user profile.
 * Pure function - no framework dependencies.
 */

import type { ProfileResponse } from "@ai-recipes/shared";
import type { IProfileRepository } from "../types/profile.types.js";
import * as Sentry from "@sentry/node";

/**
 * Get the user profile (single tenant)
 *
 * @param profileRepository - Profile data access layer
 * @returns ProfileResponse or null if no profile exists
 */
export async function getProfileUseCase(
  profileRepository: IProfileRepository
): Promise<ProfileResponse | null> {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "Get User Profile",
    },
    async () => {
      return await profileRepository.findProfile();
    },
  );
}
