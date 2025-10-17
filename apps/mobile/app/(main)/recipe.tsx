import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Share,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import type { Recipe } from "@ai-recipes/shared";
import { IngredientsList } from "@/components/recipe/ingredients-list";
import { InstructionsList } from "@/components/recipe/instructions-list";
import { formatRecipeAsText } from "@/utils/recipe-formatter";

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

  // Mock recipe for testing (will be removed once analysis is implemented)
  if (!recipe) {
    recipe = {
      name: "Homemade Vegan Chocolate Spread",
      ingredients: [
        "200g hazelnuts or sunflower seeds",
        "3 tbsp cocoa powder",
        "2 tbsp maple syrup",
        "2 tbsp coconut oil",
        "1 tsp vanilla extract",
        "Pinch of salt",
      ],
      instructions: [
        "Roast hazelnuts at 350°F (175°C) for 10-12 minutes until fragrant",
        "Let cool, then remove skins by rubbing in a towel",
        "Blend hazelnuts in a food processor until smooth and buttery (10-15 minutes)",
        "Add cocoa powder, maple syrup, coconut oil, vanilla, and salt",
        "Blend until completely smooth",
        "Store in an airtight container at room temperature for up to 2 weeks",
      ],
    };
  }

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    new Array(recipe.ingredients.length).fill(false)
  );

  const handleToggleIngredient = (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
  };

  const handleCopyText = async () => {
    try {
      const recipeText = formatRecipeAsText(recipe!);
      await Clipboard.setStringAsync(recipeText);

      Alert.alert("Copied!", "Recipe copied to clipboard", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Error", "Failed to copy recipe. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleShare = async () => {
    try {
      const recipeText = formatRecipeAsText(recipe!);

      const result = await Share.share({
        message: recipeText,
        title: recipe!.name,
      });

      if (result.action === Share.sharedAction) {
        console.log("Recipe shared successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share recipe. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleExportToNotes = async () => {
    if (Platform.OS === "ios") {
      // On iOS, use share sheet which includes Notes
      await handleShare();
    } else {
      // On Android, copy to clipboard and show instructions
      await Clipboard.setStringAsync(formatRecipeAsText(recipe!));

      Alert.alert(
        "Recipe Copied",
        "The recipe has been copied to your clipboard. Paste it in your notes app.",
        [{ text: "OK" }]
      );
    }
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

      {/* Export Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={handleExportToNotes}
          accessibilityRole="button"
          accessibilityLabel="Export recipe to Notes"
        >
          <Text style={styles.primaryButtonText}>
            {Platform.OS === "ios" ? "Export to Notes" : "Copy Recipe"}
          </Text>
        </Pressable>

        <View style={styles.secondaryActions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={handleCopyText}
            accessibilityRole="button"
            accessibilityLabel="Copy recipe as text"
          >
            <Text style={styles.secondaryButtonText}>Copy as Text</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share recipe"
          >
            <Text style={styles.secondaryButtonText}>Share</Text>
          </Pressable>
        </View>
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
