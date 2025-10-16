/**
 * Profile Domain Types (Backend Internal)
 *
 * This file contains backend-specific types for profile management.
 * API contract types are imported from @ai-recipes/shared.
 */

import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";

/**
 * Repository interface for profile data access
 * This defines the contract that the repository must implement
 */
export interface IProfileRepository {
  findProfile(): Promise<ProfileResponse | null>;
  createProfile(data: ProfileDto): Promise<ProfileResponse>;
  updateProfile(id: number, data: ProfileDto): Promise<ProfileResponse>;
  deleteProfile(id: number): Promise<void>;
}
