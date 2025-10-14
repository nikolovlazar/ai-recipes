/**
 * Profile Routes
 *
 * HTTP layer for profile management.
 * Thin controllers - only handle HTTP concerns.
 */

import { Router, Request, Response, NextFunction } from "express";
import { ProfileRepository } from "../repositories/profile.repository.js";
import { getProfileUseCase } from "../use-cases/get-profile.use-case.js";
import { createProfileUseCase } from "../use-cases/create-profile.use-case.js";
import { updateProfileUseCase } from "../use-cases/update-profile.use-case.js";
import { deleteProfileUseCase } from "../use-cases/delete-profile.use-case.js";
import type { CreateProfileDto, UpdateProfileDto } from "../types/profile.types.js";

const router = Router();

// Initialize repository (dependency injection)
const profileRepository = new ProfileRepository();

/**
 * GET /api/profile - Get user profile
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await getProfileUseCase(profileRepository);

    if (!profile) {
      return res.status(404).json({
        error: { message: "Profile not found" },
      });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/profile - Create user profile
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateProfileDto = req.body;

    const profile = await createProfileUseCase(profileRepository, data);

    res.status(201).json(profile);
  } catch (error) {
    // Handle business rule violations
    if (error instanceof Error && error.message.includes("already exists")) {
      return res.status(409).json({
        error: { message: error.message },
      });
    }
    next(error);
  }
});

/**
 * PUT /api/profile - Update user profile
 */
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: UpdateProfileDto = req.body;

    const profile = await updateProfileUseCase(profileRepository, data);

    res.json(profile);
  } catch (error) {
    // Handle business rule violations
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        error: { message: error.message },
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/profile - Delete user profile
 */
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProfileUseCase(profileRepository);

    res.status(204).send();
  } catch (error) {
    // Handle business rule violations
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        error: { message: error.message },
      });
    }
    next(error);
  }
});

export default router;
