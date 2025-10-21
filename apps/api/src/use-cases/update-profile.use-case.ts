/**
 * Update Profile Use Case
 *
 * Business logic for updating an existing user profile.
 * Pure function - no framework dependencies.
 */

import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";
import type { IProfileRepository } from "../types/profile.types.js";
import * as Sentry from "@sentry/node";

/**
 * Update an existing user profile
 *
 * Business rules:
 * - Profile must exist before updating
 * - Updates are partial (only provided fields are updated)
 *
 * @param profileRepository - Profile data access layer
 * @param data - Profile data to update
 * @returns Updated ProfileResponse
 * @throws Error if profile doesn't exist
 */
export async function updateProfileUseCase(
  profileRepository: IProfileRepository,
  data: ProfileDto,
): Promise<ProfileResponse> {
  return await Sentry.startSpan(
    {
      op: "function",
      name: "Update User Profile",
      attributes: {
        "profile.has_diet": !!data.diet,
        "profile.allergies_count": data.allergies?.length || 0,
        "profile.restrictions_count": data.restrictions?.length || 0,
      },
    },
    async () => {
      const existingProfile = await profileRepository.findProfile();

      if (!existingProfile) {
        throw new Error(
          "Profile not found. Use POST to create a profile first.",
        );
      }

      return await profileRepository.updateProfile(existingProfile.id, data);
    },
  );
}
