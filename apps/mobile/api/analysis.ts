import { API_CONFIG } from "./config";
import type { AnalysisResponse } from "@ai-recipes/shared";

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
  callbacks: AnalysisCallbacks,
): () => void {
  const url = `${API_CONFIG.baseURL}/products/${barcode}/analyze`;
  const xhr = new XMLHttpRequest();
  let fullText = "";
  let lastProcessedIndex = 0;
  let buffer = "";

  // Manual SSE parser
  const parseSSE = (data: string) => {
    buffer += data;

    // Split by double newlines (SSE event separator)
    const events = buffer.split("\n\n");
    buffer = events.pop() || ""; // Keep incomplete event in buffer

    for (const event of events) {
      if (!event.trim()) continue;

      const lines = event.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const eventData = line.substring(6); // Remove "data: " prefix

          // Check for end signal
          if (eventData === "[DONE]") {
            callbacks.onComplete({
              isSafe: false, // Will be determined by AI response
              recommendation: fullText,
            });
            return;
          }

          // Parse JSON chunk
          try {
            const parsed = JSON.parse(eventData);
            if (parsed.chunk) {
              fullText += parsed.chunk;
              callbacks.onChunk(parsed.chunk);
            }
          } catch (error) {
            // Ignore parse errors
          }
        }
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Accept", "text/event-stream");

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3 || xhr.readyState === 4) {
      // Get new data since last check
      const newData = xhr.responseText.substring(lastProcessedIndex);
      const currentLength = xhr.responseText.length;

      if (newData) {
        lastProcessedIndex = currentLength;
        parseSSE(newData);
      }
    }
  };

  xhr.onprogress = () => {
    // Get new data since last check
    const newData = xhr.responseText.substring(lastProcessedIndex);
    lastProcessedIndex = xhr.responseText.length;

    // Parse SSE
    if (newData) {
      parseSSE(newData);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Process any remaining data
      const remainingData = xhr.responseText.substring(lastProcessedIndex);
      if (remainingData) {
        parseSSE(remainingData);
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
