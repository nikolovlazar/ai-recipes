import { View, Text, StyleSheet, Pressable } from "react-native";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isNetworkError =
    error?.toLowerCase().includes("network") ||
    error?.toLowerCase().includes("connection") ||
    error?.toLowerCase().includes("timeout");

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isNetworkError ? "📡" : "⚠️"}</Text>
      <Text style={styles.title}>
        {isNetworkError ? "No Connection" : "Something went wrong"}
      </Text>
      <Text style={styles.message}>
        {error || "Unable to complete your request. Please try again."}
      </Text>

      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
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
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
