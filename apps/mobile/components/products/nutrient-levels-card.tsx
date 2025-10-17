import { View, Text, StyleSheet } from "react-native";
import type { NutrientLevels } from "@ai-recipes/shared";

interface NutrientLevelsCardProps {
  nutrientLevels?: NutrientLevels;
}

const LEVEL_COLORS = {
  low: "#85BB2F",
  moderate: "#FECB02",
  high: "#E63E11",
};

const LEVEL_LABELS = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

export function NutrientLevelsCard({ nutrientLevels }: NutrientLevelsCardProps) {
  if (!nutrientLevels) return null;

  const nutrients = [
    { key: "fat", label: "Fat" },
    { key: "saturated-fat", label: "Saturated Fat" },
    { key: "sugars", label: "Sugars" },
    { key: "salt", label: "Salt" },
  ] as const;

  const hasAnyData = nutrients.some((n) => nutrientLevels[n.key]);

  if (!hasAnyData) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Nutrient Levels</Text>

      <View style={styles.nutrientsContainer}>
        {nutrients.map(({ key, label }) => {
          const level = nutrientLevels[key];
          if (!level) return null;

          return (
            <View key={key} style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{label}</Text>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: LEVEL_COLORS[level] },
                ]}
              >
                <Text style={styles.levelText}>{LEVEL_LABELS[level]}</Text>
              </View>
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
    gap: 6,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  nutrientLabel: {
    fontSize: 13,
    color: "#333",
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
