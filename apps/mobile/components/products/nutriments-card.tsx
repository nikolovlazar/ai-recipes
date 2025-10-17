import { View, Text, StyleSheet } from "react-native";
import type { NutritionPer100g } from "@ai-recipes/shared";

interface NutrimentsCardProps {
  nutriments?: NutritionPer100g;
}

export function NutrimentsCard({ nutriments }: NutrimentsCardProps) {
  if (!nutriments) return null;

  const nutritionFacts = [
    {
      key: "energy-kcal_100g" as const,
      label: "Energy",
      unit: "kcal",
    },
    { key: "fat_100g" as const, label: "Fat", unit: "g" },
    { key: "saturated-fat_100g" as const, label: "Saturated Fat", unit: "g" },
    { key: "carbohydrates_100g" as const, label: "Carbohydrates", unit: "g" },
    { key: "sugars_100g" as const, label: "Sugars", unit: "g" },
    { key: "fiber_100g" as const, label: "Fiber", unit: "g" },
    { key: "proteins_100g" as const, label: "Protein", unit: "g" },
    { key: "salt_100g" as const, label: "Salt", unit: "g" },
  ];

  const hasAnyData = nutritionFacts.some((n) => nutriments[n.key] !== undefined);

  if (!hasAnyData) return null;

  // Helper to format nutrition values with max 1 decimal
  const formatValue = (value: number): string => {
    const rounded = Math.round(value * 10) / 10;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Nutrition / 100g</Text>

      <View style={styles.nutrientsContainer}>
        {nutritionFacts.map(({ key, label, unit }) => {
          const value = nutriments[key];
          if (value === undefined) return null;

          return (
            <View key={key} style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{label}</Text>
              <Text style={styles.nutrientValue}>
                {formatValue(value)}
                <Text style={styles.unit}>{unit}</Text>
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutrientsContainer: {
    gap: 4,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  nutrientLabel: {
    fontSize: 13,
    color: "#333",
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  unit: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#666",
  },
});
