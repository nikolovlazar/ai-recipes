/**
 * Create Profile Use Case
 *
 * Business logic for creating a new user profile.
 * Pure function - no framework dependencies.
 */

import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";
import type { IProfileRepository } from "../types/profile.types.js";

/**
 * Create a new user profile
 *
 * Business rules:
 * - Only one profile allowed (single tenant)
 * - If profile already exists, throw error
 *
 * @param profileRepository - Profile data access layer
 * @param data - Profile data to create
 * @returns Created ProfileResponse
 * @throws Error if profile already exists
 */
export async function createProfileUseCase(
  profileRepository: IProfileRepository,
  data: ProfileDto
): Promise<ProfileResponse> {
  // Check if profile already exists (single tenant)
  const existingProfile = await profileRepository.findProfile();

  if (existingProfile) {
    throw new Error("Profile already exists. Use PUT to update.");
  }

  // Create the profile
  return await profileRepository.createProfile(data);
}
