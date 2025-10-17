import { apiClient } from "./client";
import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";

/**
 * Get the current user profile
 * @throws HttpError if profile not found (404)
 */
export async function getProfile(): Promise<ProfileResponse> {
  return apiClient.get<ProfileResponse>("/profile");
}

/**
 * Create a new user profile
 * @throws HttpError if profile already exists (409)
 */
export async function createProfile(
  data: ProfileDto
): Promise<ProfileResponse> {
  return apiClient.post<ProfileResponse>("/profile", data);
}

/**
 * Update existing user profile
 * @throws HttpError if profile not found (404)
 */
export async function updateProfile(
  data: Partial<ProfileDto>
): Promise<ProfileResponse> {
  return apiClient.put<ProfileResponse>("/profile", data);
}

/**
 * Delete user profile
 * @throws HttpError if profile not found (404)
 */
export async function deleteProfile(): Promise<void> {
  await apiClient.delete<void>("/profile");
}
