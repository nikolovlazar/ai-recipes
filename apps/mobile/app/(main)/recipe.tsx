import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { Recipe } from "@ai-recipes/shared";
import { IngredientsList } from "@/components/recipe/ingredients-list";
import { InstructionsList } from "@/components/recipe/instructions-list";

export default function RecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipe?: string }>();

  // Parse recipe from params (will come from analysis screen)
  let recipe: Recipe | null = null;

  try {
    if (params.recipe) {
      recipe = JSON.parse(params.recipe as string);
    }
  } catch (error) {
    console.error("Failed to parse recipe:", error);
  }

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    new Array(recipe!.ingredients.length).fill(false),
  );

  const handleToggleIngredient = (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recipe not available</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Header */}
      <View style={styles.header}>
        <Text style={styles.recipeIcon}>🍫</Text>
        <Text style={styles.recipeTitle}>{recipe.name}</Text>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Ingredients Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <IngredientsList
          ingredients={recipe.ingredients}
          checked={checkedIngredients}
          onToggle={handleToggleIngredient}
        />
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Instructions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <InstructionsList instructions={recipe.instructions} />
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
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  recipeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    height: 40,
  },
});
