import { API_CONFIG } from "./config";
import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch(`${API_CONFIG.baseURL}/profile`);
  if (response.status === 404) throw new Error("Profile does not exist");
  if (!response.ok) throw new Error("Failed to get profile");
  return response.json();
}

export async function createProfile(
  data: ProfileDto,
): Promise<ProfileResponse> {
  const response = await fetch(`${API_CONFIG.baseURL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create profile");
  return response.json();
}

export async function updateProfile(
  data: Partial<ProfileDto>,
): Promise<ProfileResponse> {
  const response = await fetch(`${API_CONFIG.baseURL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
}

export async function deleteProfile(): Promise<void> {
  const response = await fetch(`${API_CONFIG.baseURL}/profile`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete profile");
}
