import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Sentry from "@sentry/react-native";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ErrorFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😵</Text>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        We&apos;ve been notified and are working on a fix.
      </Text>
    </View>
  );
}

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ElementType<ErrorFallbackProps>;
}

export function SentryErrorBoundary({ children }: SentryErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
});
