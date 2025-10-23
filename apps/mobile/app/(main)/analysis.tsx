import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { Image } from "expo-image";
import type { ProductDetails, AnalysisResponse } from "@ai-recipes/shared";
import { getProduct } from "@/api/products";
import { analyzeProduct } from "@/api/analysis";
import { NutrientLevelsCard } from "@/components/products/nutrient-levels-card";
import { NutrimentsCard } from "@/components/products/nutriments-card";
import { NutriScoreBadge } from "@/components/ui/nutri-score-badge";
import { ErrorState } from "@/components/ui/error-state";
import { MessageBubble } from "@/components/analysis/message-bubble";
import { TypingIndicator } from "@/components/analysis/typing-indicator";

export default function AnalysisScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const abortAnalysisRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (barcode) {
      loadProductDetails();
    }
  }, [barcode]);

  useEffect(() => {
    if (product && !analyzing && !analysis && !analysisError) {
      startAnalysis();
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (abortAnalysisRef.current) {
        abortAnalysisRef.current();
      }
    };
  }, []);

  const loadProductDetails = async () => {
    console.log(`[Analysis] Loading product details for barcode: ${barcode}`);
    try {
      setLoading(true);
      setError(null);

      const productData = await getProduct(barcode as string);
      console.log(`[Analysis] Product loaded: ${productData.name}`);
      setProduct(productData);
    } catch (err: any) {
      console.error(
        `[Analysis] Failed to load product ${barcode}:`,
        err.message,
      );
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async () => {
    console.log(`[Analysis] Starting AI analysis for barcode: ${barcode}`);
    setAnalyzing(true);
    setAnalysisError(null);
    setStreamedContent("");
    setAnalysis(null);

    let chunkCount = 0;

    // Store abort function for cleanup
    const abort = analyzeProduct(barcode as string, {
      onChunk: (chunk) => {
        chunkCount++;
        setStreamedContent((prev) => prev + chunk);

        // Auto-scroll as content arrives
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      },
      onComplete: (result) => {
        console.log(
          `[Analysis] AI analysis complete (${chunkCount} chunks received)`,
        );
        setAnalysis(result);
        setAnalyzing(false);
        abortAnalysisRef.current = null;

        // Final scroll
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      onError: (err) => {
        console.error(`[Analysis] AI analysis failed:`, err.message);
        setAnalysisError(err.message || "Analysis failed");
        setAnalyzing(false);
        abortAnalysisRef.current = null;
      },
    });

    abortAnalysisRef.current = abort;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadProductDetails} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const brandName = Array.isArray(product.brands)
    ? product.brands[0]
    : product.brands;

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {/* Compact Product Header */}
      <View style={styles.compactHeader}>
        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={styles.compactImage}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={2}>
            {product.name}
          </Text>

          {brandName && (
            <Text style={styles.compactBrand} numberOfLines={1}>
              {brandName}
            </Text>
          )}

          {/* Quantity and Category in header */}
          {(product.quantity || product.categories) && (
            <View style={styles.compactMetaRow}>
              {product.quantity && (
                <Text style={styles.compactMeta} numberOfLines={1}>
                  📦 {product.quantity}
                </Text>
              )}
              {product.categories && (
                <Text style={styles.compactMeta} numberOfLines={1}>
                  🏷️ {product.categories.split(",")[0].trim()}
                </Text>
              )}
            </View>
          )}

          {product.nutriscore_grade && (
            <View style={styles.compactNutriScore}>
              <NutriScoreBadge grade={product.nutriscore_grade} size="small" />
            </View>
          )}
        </View>
      </View>

      {/* Allergens Warning - Keep visible */}
      {product.allergens && (
        <View style={styles.compactAllergen}>
          <Text style={styles.allergenLabel}>⚠️ Contains Allergens</Text>
          <Text style={styles.compactAllergenText}>
            {product.allergens
              .split(",")
              .map((allergen) =>
                allergen
                  .trim()
                  .replace(/^en:/, "")
                  .replace(/-/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
              )
              .join(", ")}
          </Text>
        </View>
      )}

      {/* Compact Nutrient Levels & Nutrition - Side by side */}
      <View style={styles.compactNutrition}>
        <View style={styles.compactColumn}>
          <NutrientLevelsCard nutrientLevels={product.nutrient_levels} />
        </View>
        <View style={styles.compactColumn}>
          <NutrimentsCard nutriments={product.nutriments} />
        </View>
      </View>

      {/* AI Analysis Section */}
      <View style={styles.analysisSection}>
        <View style={styles.analysisSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>AI Analysis</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Streaming Messages */}
        {streamedContent && (
          <MessageBubble content={streamedContent} isStreaming={analyzing} />
        )}

        {/* Typing Indicator */}
        {analyzing && !streamedContent && <TypingIndicator />}

        {/* Analysis Error */}
        {analysisError && (
          <ErrorState error={analysisError} onRetry={startAnalysis} />
        )}

        {/* Action Buttons */}
        {analysis && !analyzing && (
          <View style={styles.actionButtons}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Search Another</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  compactHeader: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 12,
  },
  compactImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  compactInfo: {
    flex: 1,
    justifyContent: "center",
  },
  compactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 3,
  },
  compactBrand: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  compactMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  compactMeta: {
    fontSize: 11,
    color: "#666",
  },
  compactNutriScore: {
    flexDirection: "row",
    marginTop: 2,
  },
  compactAllergen: {
    backgroundColor: "#fff3cd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffc107",
  },
  allergenLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#856404",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compactAllergenText: {
    fontSize: 13,
    color: "#856404",
    fontWeight: "500",
  },
  compactNutrition: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  compactColumn: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
  },
  analysisSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  analysisSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  separatorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  actionButtons: {
    marginTop: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    height: 40,
  },
});
