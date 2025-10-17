import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.title}>AI Recipes</Text>
        <Text style={styles.tagline}>Healthier choices, made easy</Text>
      </View>

      <View style={styles.benefitsContainer}>
        <BenefitItem
          icon="✓"
          text="Find healthier alternatives to your favorite products"
        />
        <BenefitItem icon="✓" text="Get personalized recipe recommendations" />
        <BenefitItem
          icon="✓"
          text="Based on your dietary preferences and allergies"
        />
        <BenefitItem icon="✓" text="Your data stays private and anonymous" />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(onboarding)/profile-form")}
        accessibilityRole="button"
        accessibilityLabel="Get started with onboarding"
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </ScrollView>
  );
}

function BenefitItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.benefitItem}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
  },
  tagline: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  benefitsContainer: {
    marginBottom: 48,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "#007AFF",
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
