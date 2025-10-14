/**
 * Products Routes
 *
 * HTTP layer for product search and details.
 * Thin controllers - only handle HTTP concerns.
 */

import { Router, Request, Response, NextFunction } from "express";
import { ProductsRepository } from "../repositories/products.repository.js";
import { ProfileRepository } from "../repositories/profile.repository.js";
import { searchProductsUseCase } from "../use-cases/search-products.use-case.js";
import { getProductUseCase } from "../use-cases/get-product.use-case.js";
import { analyzeProductUseCase } from "../use-cases/analyze-product.use-case.js";

const router = Router();

// Initialize repositories (dependency injection)
const productsRepository = new ProductsRepository();
const profileRepository = new ProfileRepository();

/**
 * GET /api/products/search?q={query}&page={page}
 * Search for products by name/text
 */
router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;

      if (!query) {
        return res.status(400).json({
          error: { message: "Search query 'q' is required" },
        });
      }

      const results = await searchProductsUseCase(productsRepository, {
        query,
        page,
      });

      res.json(results);
    } catch (error) {
      if (error instanceof Error && error.message.includes("cannot be empty")) {
        return res.status(400).json({
          error: { message: error.message },
        });
      }
      next(error);
    }
  },
);

/**
 * GET /api/products/:barcode
 * Get product details by barcode
 */
router.get(
  "/:barcode",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { barcode } = req.params;

      const product = await getProductUseCase(productsRepository, barcode);

      if (!product) {
        return res.status(404).json({
          error: { message: "Product not found" },
        });
      }

      res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid barcode")) {
        return res.status(400).json({
          error: { message: error.message },
        });
      }
      next(error);
    }
  },
);

/**
 * POST /api/products/:barcode/analyze
 * Analyze a product against user profile (AI integration pending)
 */
router.get(
  "/:barcode/analyze",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { barcode } = req.params;

      // Gather data for analysis
      const context = await analyzeProductUseCase(
        profileRepository,
        productsRepository,
        barcode,
      );

      // Prepare optimized data for LLM (minimize tokens)
      const userProfile = {
        diet: context.profile.diet,
        allergies: context.profile.allergies,
        restrictions: context.profile.restrictions,
        age: context.profile.age,
        weight: context.profile.weight,
        goals: context.profile.goals,
      };

      const productForLLM = {
        name: context.product.name,
        brands: context.product.brands,
        allergens: context.product.allergens_tags?.map(tag => tag.replace('en:', '')) || [],
        nutriscore: context.product.nutriscore_grade,
        nova_group: context.product.nova_group,
        nutrient_levels: context.product.nutrient_levels,
        nutrition_per_100g: {
          energy_kcal: context.product.nutriments?.["energy-kcal_100g"],
          fat: context.product.nutriments?.fat_100g,
          saturated_fat: context.product.nutriments?.["saturated-fat_100g"],
          carbs: context.product.nutriments?.carbohydrates_100g,
          sugars: context.product.nutriments?.sugars_100g,
          protein: context.product.nutriments?.proteins_100g,
          salt: context.product.nutriments?.salt_100g,
          fiber: context.product.nutriments?.fiber_100g,
        },
        ingredients: context.product.ingredients?.map(ing => ({
          name: ing.id?.replace('en:', '') || ing.text,
          percent: ing.percent || ing.percent_estimate,
          vegan: ing.vegan,
          vegetarian: ing.vegetarian,
        })) || [],
      };

      // TODO: Send to OpenAI for analysis
      // For now, return the formatted data
      res.json({
        message: "Data prepared for LLM. AI analysis not yet implemented.",
        llm_input: {
          user_profile: userProfile,
          product: productForLLM,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Profile not found")) {
          return res.status(400).json({
            error: { message: error.message },
          });
        }
        if (error.message.includes("Product not found")) {
          return res.status(404).json({
            error: { message: error.message },
          });
        }
      }
      next(error);
    }
  },
);

export default router;
