/**
 * Profile Repository
 *
 * Handles all database operations for user profiles.
 * This is the only place where Drizzle ORM is used for profile data.
 */

import { eq } from "drizzle-orm";
import { db, userTable } from "../db/index.js";
import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";
import type { IProfileRepository } from "../types/profile.types.js";

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
  async createProfile(data: ProfileDto): Promise<ProfileResponse> {
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
    data: ProfileDto
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
      diet: profile.diet ?? undefined,
      allergies: profile.allergies ? JSON.parse(profile.allergies) : undefined,
      restrictions: profile.restrictions
        ? JSON.parse(profile.restrictions)
        : undefined,
      age: profile.age ?? undefined,
      weight: profile.weight ?? undefined,
      goals: profile.goals ?? undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
