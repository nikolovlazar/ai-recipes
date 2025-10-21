/**
 * Delete Profile Use Case
 *
 * Business logic for deleting a user profile.
 * Pure function - no framework dependencies.
 */

import type { IProfileRepository } from "../types/profile.types.js";
import * as Sentry from "@sentry/node";

/**
 * Delete the user profile
 *
 * Business rules:
 * - Profile must exist before deleting
 *
 * @param profileRepository - Profile data access layer
 * @throws Error if profile doesn't exist
 */
export async function deleteProfileUseCase(
  profileRepository: IProfileRepository,
): Promise<void> {
  await Sentry.startSpan(
    {
      op: "function",
      name: "Delete User Profile",
    },
    async () => {
      const existingProfile = await profileRepository.findProfile();

      if (!existingProfile) {
        throw new Error("Profile not found. Nothing to delete.");
      }

      await profileRepository.deleteProfile(existingProfile.id);
    },
  );
}
