import { View, Text, Pressable, StyleSheet } from "react-native";

interface IngredientsListProps {
  ingredients: string[];
  checked: boolean[];
  onToggle: (index: number) => void;
}

export function IngredientsList({
  ingredients,
  checked,
  onToggle,
}: IngredientsListProps) {
  return (
    <View style={styles.container}>
      {ingredients.map((ingredient, index) => {
        const isChecked = checked[index];

        return (
          <Pressable
            key={index}
            style={styles.ingredientRow}
            onPress={() => onToggle(index)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            accessibilityLabel={`${ingredient}, ${isChecked ? "checked" : "unchecked"}`}
          >
            <View style={styles.checkbox}>
              {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.ingredientText,
                isChecked && styles.ingredientTextChecked,
              ]}
            >
              {ingredient}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
  },
  ingredientTextChecked: {
    color: "#999",
    textDecorationLine: "line-through",
  },
});
