import { API_CONFIG } from "./config";
import type { AnalysisResponse } from "@ai-recipes/shared";
import { createParser } from "eventsource-parser";

interface AnalysisCallbacks {
  onChunk: (chunk: string) => void;
  onComplete: (analysis: AnalysisResponse) => void;
  onError: (error: Error) => void;
}

/**
 * Analyze product with streaming response
 * Uses XMLHttpRequest for better React Native compatibility
 * @param barcode - Product barcode
 * @param callbacks - Callbacks for stream events
 * @returns Abort function to cancel the request
 */
export function analyzeProduct(
  barcode: string,
  callbacks: AnalysisCallbacks
): () => void {
  const url = `${API_CONFIG.baseURL}/products/${barcode}/analyze`;
  const xhr = new XMLHttpRequest();
  let fullText = "";
  let lastProcessedIndex = 0;

  // Create SSE parser
  const parser = createParser({
    onEvent: (event) => {
      const data = event.data;

      // Check for end signal
      if (data === "[DONE]") {
        callbacks.onComplete({
          isSafe: false, // Will be determined by AI response
          recommendation: fullText,
        });
        return;
      }

      // Parse JSON chunk
      try {
        const parsed = JSON.parse(data);
        if (parsed.chunk) {
          fullText += parsed.chunk;
          callbacks.onChunk(parsed.chunk);
        }
      } catch (error) {
        // Ignore parse errors
      }
    },
  });

  xhr.open("GET", url, true);

  // Set headers
  Object.entries(API_CONFIG.headers).forEach(([key, value]) => {
    xhr.setRequestHeader(key, value);
  });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3 || xhr.readyState === 4) {
      // Get new data since last check
      const newData = xhr.responseText.substring(lastProcessedIndex);
      const currentLength = xhr.responseText.length;

      if (newData) {
        lastProcessedIndex = currentLength;
        parser.feed(newData);
      }
    }
  };

  xhr.onprogress = () => {
    // Get new data since last check
    const newData = xhr.responseText.substring(lastProcessedIndex);
    lastProcessedIndex = xhr.responseText.length;

    // Feed to parser
    if (newData) {
      parser.feed(newData);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Process any remaining data
      const remainingData = xhr.responseText.substring(lastProcessedIndex);
      if (remainingData) {
        parser.feed(remainingData);
      }

      // If no [DONE] signal was received, complete anyway
      if (fullText) {
        callbacks.onComplete({
          isSafe: false,
          recommendation: fullText,
        });
      }
    } else {
      const error = new Error(`HTTP ${xhr.status}: Analysis failed`);
      callbacks.onError(error);
    }
  };

  xhr.onerror = () => {
    const error = new Error("Network error during analysis");
    callbacks.onError(error);
  };

  xhr.ontimeout = () => {
    const error = new Error("Request timeout");
    callbacks.onError(error);
  };

  xhr.send();

  // Return abort function
  return () => {
    xhr.abort();
  };
}
