import { API_CONFIG } from "./config";
import type {
  SearchProductsResponse,
  ProductDetails,
} from "@ai-recipes/shared";

export async function searchProducts(
  query: string,
  page: number = 1,
): Promise<SearchProductsResponse> {
  if (!query || query.trim().length < 2) {
    throw new Error("Search query must be at least 2 characters");
  }

  const params = new URLSearchParams({
    q: query.trim(),
    page: page.toString(),
  });

  const response = await fetch(
    `${API_CONFIG.baseURL}/products/search?${params.toString()}`,
  );
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
}

export async function getProduct(barcode: string): Promise<ProductDetails> {
  if (!barcode) {
    throw new Error("Barcode is required");
  }

  const response = await fetch(`${API_CONFIG.baseURL}/products/${barcode}`);
  if (!response.ok) throw new Error("Failed to get product");
  return response.json();
}
