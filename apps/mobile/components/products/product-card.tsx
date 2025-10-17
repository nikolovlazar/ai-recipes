import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { memo } from "react";
import type { ProductSearchResult } from "@ai-recipes/shared";
import { NutriScoreBadge } from "@/components/ui/nutri-score-badge";

interface ProductCardProps {
  product: ProductSearchResult;
  onPress: (barcode: string) => void;
}

export const ProductCard = memo(
  ({ product, onPress }: ProductCardProps) => {
    const brandName = Array.isArray(product.brands)
      ? product.brands[0]
      : product.brands;

    // Parse country tags into readable names
    // Format: ["en:united-states", "en:canada"] -> ["United States", "Canada"]
    const countries = product.countries_tags
      ? product.countries_tags
          .map((tag) => {
            // Remove language prefix (e.g., "en:")
            const countryCode = tag.includes(":") ? tag.split(":")[1] : tag;
            // Replace hyphens with spaces and capitalize words
            return countryCode
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          })
          .filter(Boolean)
      : [];

    return (
      <Pressable
        style={styles.card}
        onPress={() => onPress(product.barcode)}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}${brandName ? ` by ${brandName}` : ""}${countries.length > 0 ? `. Available in ${countries.join(", ")}` : ""}${product.nutriscore_grade ? `. Nutri-Score ${product.nutriscore_grade.toUpperCase()}` : ""}`}
      >
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              placeholder={require("@/assets/images/partial-react-logo.png")}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No image</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          {brandName && (
            <Text style={styles.brandName} numberOfLines={1}>
              {brandName}
            </Text>
          )}

          {countries.length > 0 && (
            <View style={styles.countriesContainer}>
              {countries.slice(0, 3).map((country, index) => (
                <View key={index} style={styles.countryTag}>
                  <Text style={styles.countryText}>{country}</Text>
                </View>
              ))}
              {countries.length > 3 && (
                <Text style={styles.moreCountries}>+{countries.length - 3}</Text>
              )}
            </View>
          )}

          <View style={styles.footer}>
            {product.nutriscore_grade && (
              <NutriScoreBadge grade={product.nutriscore_grade} size="small" />
            )}
          </View>
        </View>

        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product.barcode === nextProps.product.barcode;
  }
);

ProductCard.displayName = "ProductCard";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: "#999",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  countriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  countryTag: {
    backgroundColor: "#e8f4ff",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countryText: {
    fontSize: 11,
    color: "#007AFF",
    fontWeight: "500",
  },
  moreCountries: {
    fontSize: 11,
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 24,
    color: "#007AFF",
  },
});
