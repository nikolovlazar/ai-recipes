import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Recipe } from "@ai-recipes/shared";

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View recipe: ${recipe.name}`}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>🍳</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.subtitle}>
            {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.viewRecipeText}>View Full Recipe</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#34C759",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  viewRecipeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34C759",
  },
  chevron: {
    fontSize: 24,
    color: "#34C759",
  },
});
