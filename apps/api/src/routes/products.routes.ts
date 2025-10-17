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
import { gatherAnalysisContextUseCase } from "../use-cases/gather-analysis-context.use-case.js";
import { analyzeProductUseCase } from "../use-cases/analyze-product.use-case.js";

const router = Router();

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
 * Analyze a product against user profile using AI (streaming)
 */
router.get(
  "/:barcode/analyze",
  async (req: Request, res: Response, next: NextFunction) => {
    const abortController = new AbortController();

    req.on("close", () => {
      abortController.abort();
    });

    try {
      const { barcode } = req.params;

      const context = await gatherAnalysisContextUseCase(
        profileRepository,
        productsRepository,
        barcode,
      );

      const result = await analyzeProductUseCase(
        context,
        abortController.signal,
      );

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
      res.flushHeaders(); // Send headers immediately

      const stream = result.textStream;

      for await (const chunk of stream) {
        if (abortController.signal.aborted) {
          break;
        }

        const data = `data: ${JSON.stringify({ chunk })}\n\n`;
        res.write(data);

        if (typeof (res as any).flush === "function") {
          (res as any).flush();
        }
      }

      if (!abortController.signal.aborted) {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }

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
        if (error.message.includes("ANTHROPIC_API_KEY")) {
          return res.status(500).json({
            error: { message: "AI service is not configured properly" },
          });
        }
      }
      next(error);
    }
  },
);

export default router;
