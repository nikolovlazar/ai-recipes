/**
 * Profile Repository
 *
 * Handles all database operations for user profiles.
 * This is the only place where Drizzle ORM is used for profile data.
 */

import { eq } from "drizzle-orm";
import { db, userTable } from "../db/index.js";
import type {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponse,
  IProfileRepository,
} from "../types/profile.types.js";

export class ProfileRepository implements IProfileRepository {
  /**
   * Find the user profile (single tenant - returns first row)
   */
  async findProfile(): Promise<ProfileResponse | null> {
    const [profile] = await db.select().from(userTable).limit(1);

    if (!profile) {
      return null;
    }

    return this.mapToResponse(profile);
  }

  /**
   * Create a new user profile
   */
  async createProfile(data: CreateProfileDto): Promise<ProfileResponse> {
    const [profile] = await db
      .insert(userTable)
      .values({
        diet: data.diet,
        allergies: data.allergies ? JSON.stringify(data.allergies) : null,
        restrictions: data.restrictions
          ? JSON.stringify(data.restrictions)
          : null,
        age: data.age,
        weight: data.weight,
        goals: data.goals,
      })
      .returning();

    return this.mapToResponse(profile);
  }

  /**
   * Update an existing user profile
   */
  async updateProfile(
    id: number,
    data: UpdateProfileDto
  ): Promise<ProfileResponse> {
    const [profile] = await db
      .update(userTable)
      .set({
        diet: data.diet,
        allergies: data.allergies ? JSON.stringify(data.allergies) : undefined,
        restrictions: data.restrictions
          ? JSON.stringify(data.restrictions)
          : undefined,
        age: data.age,
        weight: data.weight,
        goals: data.goals,
      })
      .where(eq(userTable.id, id))
      .returning();

    return this.mapToResponse(profile);
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(id: number): Promise<void> {
    await db.delete(userTable).where(eq(userTable.id, id));
  }

  /**
   * Map database record to ProfileResponse
   * Handles JSON parsing for arrays
   */
  private mapToResponse(profile: typeof userTable.$inferSelect): ProfileResponse {
    return {
      id: profile.id,
      diet: profile.diet,
      allergies: profile.allergies ? JSON.parse(profile.allergies) : null,
      restrictions: profile.restrictions
        ? JSON.parse(profile.restrictions)
        : null,
      age: profile.age,
      weight: profile.weight,
      goals: profile.goals,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
