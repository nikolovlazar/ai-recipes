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
import * as Sentry from "@sentry/node";

export class ProfileRepository implements IProfileRepository {
  async findProfile(): Promise<ProfileResponse | null> {
    const query = db.select().from(userTable).limit(1);

    return await Sentry.startSpan(
      {
        name: query.toSQL().sql,
        op: "db.query",
        attributes: {
          "db.system": "sqlite",
        },
      },
      async (span) => {
        const [profile] = await query;

        if (!profile) {
          span.setAttribute("profile.found", false);
          return null;
        }

        span.setAttribute("profile.found", true);
        span.setAttribute("profile.id", profile.id);
        return this.mapToResponse(profile);
      },
    );
  }

  async createProfile(data: ProfileDto): Promise<ProfileResponse> {
    const query = db
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

    return await Sentry.startSpan(
      {
        name: query.toSQL().sql,
        op: "db.query",
        attributes: {
          "db.system": "sqlite",
          "profile.has_diet": !!data.diet,
          "profile.allergies_count": data.allergies?.length || 0,
          "profile.restrictions_count": data.restrictions?.length || 0,
        },
      },
      async (span) => {
        const [profile] = await query;

        span.setAttribute("profile.id", profile.id);
        return this.mapToResponse(profile);
      },
    );
  }

  async updateProfile(id: number, data: ProfileDto): Promise<ProfileResponse> {
    const query = db
      .update(userTable)
      .set({
        diet: data.diet ?? null,
        allergies: data.allergies?.length
          ? JSON.stringify(data.allergies)
          : null,
        restrictions: data.restrictions?.length
          ? JSON.stringify(data.restrictions)
          : null,
        age: data.age ?? null,
        weight: data.weight ?? null,
        goals: data.goals ?? null,
      })
      .where(eq(userTable.id, id))
      .returning();

    return await Sentry.startSpan(
      {
        name: query.toSQL().sql,
        op: "db.query",
        attributes: {
          "db.system": "sqlite",
          "profile.id": id,
          "profile.has_diet": !!data.diet,
          "profile.allergies_count": data.allergies?.length || 0,
          "profile.restrictions_count": data.restrictions?.length || 0,
        },
      },
      async () => {
        const [profile] = await query;
        return this.mapToResponse(profile);
      },
    );
  }

  async deleteProfile(id: number): Promise<void> {
    const query = db.delete(userTable).where(eq(userTable.id, id));

    await Sentry.startSpan(
      {
        name: query.toSQL().sql,
        op: "db.query",
        attributes: {
          "db.system": "sqlite",
          "profile.id": id,
        },
      },
      async () => {
        await query;
      },
    );
  }

  private mapToResponse(
    profile: typeof userTable.$inferSelect,
  ): ProfileResponse {
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
