/**
 * Profile Domain Types and DTOs
 *
 * These types define the contract between layers:
 * - DTOs for API requests/responses
 * - Domain models for business logic
 */

/**
 * DTO for creating a new profile (onboarding)
 */
export interface CreateProfileDto {
  diet?: string;
  allergies?: string[];
  restrictions?: string[];
  age?: number;
  weight?: number;
  goals?: string;
}

/**
 * DTO for updating an existing profile
 */
export interface UpdateProfileDto {
  diet?: string;
  allergies?: string[];
  restrictions?: string[];
  age?: number;
  weight?: number;
  goals?: string;
}

/**
 * Profile response (what the API returns)
 */
export interface ProfileResponse {
  id: number;
  diet?: string | null;
  allergies?: string[] | null;
  restrictions?: string[] | null;
  age?: number | null;
  weight?: number | null;
  goals?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Repository interface for profile data access
 * This defines the contract that the repository must implement
 */
export interface IProfileRepository {
  findProfile(): Promise<ProfileResponse | null>;
  createProfile(data: CreateProfileDto): Promise<ProfileResponse>;
  updateProfile(id: number, data: UpdateProfileDto): Promise<ProfileResponse>;
  deleteProfile(id: number): Promise<void>;
}
