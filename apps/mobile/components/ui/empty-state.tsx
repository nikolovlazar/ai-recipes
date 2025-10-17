import { View, Text, StyleSheet, Pressable } from "react-native";

interface EmptyStateProps {
  query?: string;
  onClear?: () => void;
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  if (!query) {
    // Initial state - no search yet
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Search for a product</Text>
        <Text style={styles.subtitle}>
          Try searching for "Nutella", "Coca Cola", or "Oreos"
        </Text>
      </View>
    );
  }

  // No results state
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>😕</Text>
      <Text style={styles.title}>No products found</Text>
      <Text style={styles.subtitle}>
        We couldn't find any products matching "{query}"
      </Text>

      <View style={styles.suggestions}>
        <Text style={styles.suggestionsTitle}>Try:</Text>
        <Text style={styles.suggestionItem}>• Checking your spelling</Text>
        <Text style={styles.suggestionItem}>• Using simpler search terms</Text>
        <Text style={styles.suggestionItem}>• Searching by brand name</Text>
      </View>

      {onClear && (
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear Search</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  suggestions: {
    alignSelf: "stretch",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  clearButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
