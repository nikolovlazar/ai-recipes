/**
 * Delete Profile Use Case
 *
 * Business logic for deleting a user profile.
 * Pure function - no framework dependencies.
 */

import type { IProfileRepository } from "../types/profile.types.js";

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
  profileRepository: IProfileRepository
): Promise<void> {
  // Check if profile exists
  const existingProfile = await profileRepository.findProfile();

  if (!existingProfile) {
    throw new Error("Profile not found. Nothing to delete.");
  }

  // Delete the profile
  await profileRepository.deleteProfile(existingProfile.id);
}
