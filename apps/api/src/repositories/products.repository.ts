/**
 * Products Repository
 *
 * Handles product data access using Open Food Facts SDK with intelligent caching.
 * Implements cache-first strategy with 7-day TTL.
 *
 * This is the only place where:
 * - Open Food Facts SDK is used
 * - Product caching logic exists
 * - Database operations for products occur
 */

import { OpenFoodFacts, SearchApi } from "@openfoodfacts/openfoodfacts-nodejs";
import { eq } from "drizzle-orm";
import { db, productsTable } from "../db/index.js";
import type {
  ProductSearchResult,
  SearchProductsResponse,
  ProductDetails,
} from "@ai-recipes/shared";
import type {
  IProductsRepository,
  SearchProductsDto,
} from "../types/product.types.js";
import * as Sentry from "@sentry/node";

export class ProductsRepository implements IProductsRepository {
  private client: OpenFoodFacts;
  private searchApi: SearchApi;
  private readonly SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  constructor() {
    this.client = new OpenFoodFacts(globalThis.fetch);
    this.searchApi = new SearchApi(globalThis.fetch);
  }

  async searchProducts(
    dto: SearchProductsDto,
  ): Promise<SearchProductsResponse> {
    return await Sentry.startSpan(
      {
        name: "Search products by query",
        op: "http.client",
        attributes: {
          "search.query": dto.query,
          "search.page": dto.page || 1,
        },
      },
      async () => {
        try {
          const { data, error } = await this.searchApi.search({
            q: dto.query,
            langs: ["en"],
            page: dto.page || 1,
            page_size: 20,
            // Note: SearchAPI may not support fields parameter
            // It returns a predefined set of fields
          });

          if (error || !data) {
            throw new Error(`Search failed: ${error || "No data returned"}`);
          }

          const searchResponse = data as any;

          // Map API response to our domain model
          // SearchApi returns 'hits' not 'products'
          const products: ProductSearchResult[] = (
            searchResponse.hits || []
          ).map((product: any) => ({
            barcode: product.code || product._id,
            name: product.product_name || "Unknown Product",
            brands: product.brands,
            image_url: product.image_url || product.image_front_url,
            nutriscore_grade: product.nutriscore_grade,
            countries_tags: product.countries_tags,
          }));

          return {
            products,
            count: searchResponse.count || products.length,
            page: searchResponse.page || dto.page || 1,
          };
        } catch (error) {
          console.error("Search error:", error);
          throw error;
        }
      },
    );
  }

  async getProductByBarcode(barcode: string): Promise<ProductDetails | null> {
    // 1. Check cache first
    const cachedProduct = await this.getFromCache(barcode);

    if (cachedProduct) {
      return cachedProduct;
    }

    // 2. Cache miss or stale - fetch from API
    const freshProduct = await this.fetchFromAPI(barcode);

    if (!freshProduct) {
      return null; // Product not found
    }

    // 3. Store in cache
    await this.storeInCache(barcode, freshProduct);

    return {
      ...freshProduct,
      cached: false,
      cached_at: new Date(),
    };
  }

  private async getFromCache(barcode: string): Promise<ProductDetails | null> {
    const query = db
      .select()
      .from(productsTable)
      .where(eq(productsTable.barcode, barcode))
      .limit(1);

    return await Sentry.startSpan(
      {
        name: query.toSQL().sql,
        op: "db.query",
        attributes: {
          "db.system": "sqlite",
          "product.barcode": barcode,
        },
      },
      async (span) => {
        const [cached] = await query;

        if (!cached) {
          span.setAttribute("cache.hit", false);
          span.setAttribute("cache.miss.reason", "not_found");
          return null; // Not in cache
        }

        const cacheAge = Date.now() - cached.cachedAt.getTime();

        if (cacheAge > this.SEVEN_DAYS_MS) {
          console.log(
            `Cache stale for barcode ${barcode} (age: ${cacheAge}ms)`,
          );
          span.setAttribute("cache.hit", false);
          span.setAttribute("cache.miss.reason", "expired");
          span.setAttribute("cache.age_ms", cacheAge);
          return null; // Cache expired
        }

        console.log(`Cache hit for barcode ${barcode}`);
        span.setAttribute("cache.hit", true);
        span.setAttribute("cache.age_ms", cacheAge);
        const productData = JSON.parse(cached.data);

        return {
          ...productData,
          cached: true,
          cached_at: cached.cachedAt,
        };
      },
    );
  }

  private async fetchFromAPI(barcode: string): Promise<ProductDetails | null> {
    return await Sentry.startSpan(
      {
        name: "Fetch product from Open Food Facts API",
        op: "http.client",
        attributes: {
          "product.barcode": barcode,
          "http.service": "openfoodfacts",
        },
      },
      async (span) => {
        try {
          console.log(`Fetching barcode ${barcode} from OFF API`);

          const { data, error } = await this.client.getProductV2(barcode);

          if (error || !data) {
            console.error(`API error for barcode ${barcode}:`, error);
            span.setAttribute("product.found", false);
            span.setAttribute("error.type", error || "no_data");
            return null;
          }

          const apiResponse = data as any;
          const product = apiResponse.product;

          if (!product) {
            span.setAttribute("product.found", false);
            return null; // Product not found
          }

          span.setAttribute("product.found", true);
          span.setAttribute(
            "product.name",
            product.product_name || "Unknown Product",
          );

          return {
            barcode: product.code || barcode,
            name: product.product_name || "Unknown Product",
            brands: product.brands,
            categories: product.categories,
            categories_tags: product.categories_tags,
            image_url: product.image_url || product.image_front_url,
            ingredients_text: product.ingredients_text,
            ingredients: product.ingredients,
            allergens: product.allergens,
            allergens_tags: product.allergens_tags,
            traces: product.traces,
            traces_tags: product.traces_tags,
            nutriscore_grade: product.nutriscore_grade,
            nova_group: product.nova_group,
            ecoscore_grade: product.ecoscore_grade,
            nutrient_levels: product.nutrient_levels,
            nutriments: product.nutriments,
            quantity: product.quantity,
            serving_size: product.serving_size,
          };
        } catch (error) {
          console.error(`Failed to fetch barcode ${barcode}:`, error);
          throw error;
        }
      },
    );
  }

  private async storeInCache(
    barcode: string,
    product: ProductDetails,
  ): Promise<void> {
    try {
      const productData = {
        barcode,
        name: product.name,
        brands: product.brands,
        categories: product.categories,
        categories_tags: product.categories_tags,
        image_url: product.image_url,
        ingredients_text: product.ingredients_text,
        ingredients: product.ingredients,
        allergens: product.allergens,
        allergens_tags: product.allergens_tags,
        traces: product.traces,
        traces_tags: product.traces_tags,
        nutriscore_grade: product.nutriscore_grade,
        nova_group: product.nova_group,
        ecoscore_grade: product.ecoscore_grade,
        nutrient_levels: product.nutrient_levels,
        nutriments: product.nutriments,
        quantity: product.quantity,
        serving_size: product.serving_size,
      };

      const query = db
        .insert(productsTable)
        .values({
          barcode,
          name: product.name,
          data: JSON.stringify(productData),
        })
        .onConflictDoUpdate({
          target: productsTable.barcode,
          set: {
            name: product.name,
            data: JSON.stringify(productData),
            cachedAt: new Date(),
          },
        });

      await Sentry.startSpan(
        {
          name: query.toSQL().sql,
          op: "db.query",
          attributes: {
            "db.system": "sqlite",
            "product.barcode": barcode,
            "product.name": product.name,
          },
        },
        async (span) => {
          await query;
          span.setAttribute("cache.stored", true);
          console.log(`Cached barcode ${barcode}`);
        },
      );
    } catch (error) {
      console.error(`Failed to cache barcode ${barcode}:`, error);
      // Don't throw - caching failure shouldn't break the request
    }
  }
}
