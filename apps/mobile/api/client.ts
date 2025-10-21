import { API_CONFIG } from "./config";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

export class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestConfig
  ): Promise<Response> {
    const { timeout = API_CONFIG.timeout, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          ...API_CONFIG.headers,
          ...fetchConfig.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new HttpError("Request timeout", 408);
      }

      throw error;
    }
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = config.method || 'GET';

    console.log(`[API] ${method} ${endpoint}`);

    try {
      const startTime = Date.now();
      const response = await this.fetchWithTimeout(url, config);
      const duration = Date.now() - startTime;

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[API] ${method} ${endpoint} - ${response.status} (${duration}ms)`,
          errorData.error?.message || 'Request failed'
        );
        throw new HttpError(
          errorData.error?.message || "Request failed",
          response.status,
          errorData
        );
      }

      console.log(`[API] ${method} ${endpoint} - ${response.status} (${duration}ms)`);

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      // Parse response
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      // Network errors
      console.error(`[API] ${method} ${endpoint} - Network error`, error);
      throw new HttpError(
        "Network error. Check your internet connection.",
        0
      );
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new APIClient(API_CONFIG.baseURL);
