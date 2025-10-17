import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";

export default function AboutScreen() {
  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Info */}
      <View style={styles.header}>
        <Text style={styles.appIcon}>🍽️</Text>
        <Text style={styles.appName}>AI Recipes</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bodyText}>
          Find healthier alternatives to your favorite products with AI-powered
          analysis and personalized recipes based on your dietary preferences
          and health goals.
        </Text>
      </View>

      {/* Workshop Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workshop</Text>
        <Text style={styles.bodyText}>
          This app was built for the Sentry.io workshop to demonstrate error
          monitoring and performance tracking in React Native applications.
        </Text>
      </View>

      {/* Open Food Facts Attribution (REQUIRED) */}
      <View style={styles.attributionSection}>
        <Text style={styles.sectionTitle}>Data Attribution</Text>

        <Text style={styles.bodyText}>
          Product data provided by{" "}
          <Text
            style={styles.link}
            onPress={() => openURL("https://openfoodfacts.org")}
          >
            Open Food Facts
          </Text>
          .
        </Text>

        <Text style={styles.bodyText}>
          Open Food Facts is an open database of food products from around the
          world. The database is made available under the{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openURL("https://opendatacommons.org/licenses/odbl/1.0/")
            }
          >
            Open Database License (ODbL)
          </Text>
          .
        </Text>

        <Pressable
          style={styles.linkButton}
          onPress={() => openURL("https://openfoodfacts.org")}
        >
          <Text style={styles.linkButtonText}>Visit Open Food Facts</Text>
          <Text style={styles.linkButtonIcon}>↗</Text>
        </Pressable>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>

        <Pressable
          style={styles.linkRow}
          onPress={() => openURL("https://sentry.io/")}
        >
          <Text style={styles.linkRowText}>Sentry.io</Text>
          <Text style={styles.linkRowIcon}>↗</Text>
        </Pressable>
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
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  appIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  attributionSection: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 12,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  linkButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButtonIcon: {
    color: "#fff",
    fontSize: 20,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 8,
  },
  linkRowText: {
    fontSize: 16,
    color: "#007AFF",
  },
  linkRowIcon: {
    fontSize: 18,
    color: "#007AFF",
  },
  footer: {
    height: 40,
  },
});
