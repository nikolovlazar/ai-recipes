/**
 * Get Profile Use Case
 *
 * Business logic for retrieving the user profile.
 * Pure function - no framework dependencies.
 */

import type {
  IProfileRepository,
  ProfileResponse,
} from "../types/profile.types.js";

/**
 * Get the user profile (single tenant)
 *
 * @param profileRepository - Profile data access layer
 * @returns ProfileResponse or null if no profile exists
 */
export async function getProfileUseCase(
  profileRepository: IProfileRepository
): Promise<ProfileResponse | null> {
  return await profileRepository.findProfile();
}
