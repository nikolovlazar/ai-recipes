/**
 * Update Profile Use Case
 *
 * Business logic for updating an existing user profile.
 * Pure function - no framework dependencies.
 */

import type {
  IProfileRepository,
  UpdateProfileDto,
  ProfileResponse,
} from "../types/profile.types.js";

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
  data: UpdateProfileDto
): Promise<ProfileResponse> {
  // Check if profile exists
  const existingProfile = await profileRepository.findProfile();

  if (!existingProfile) {
    throw new Error("Profile not found. Use POST to create a profile first.");
  }

  // Update the profile
  return await profileRepository.updateProfile(existingProfile.id, data);
}
