import { View, Text, StyleSheet } from "react-native";

interface NutriScoreBadgeProps {
  grade?: string;
  size?: "small" | "medium" | "large";
}

const NUTRI_SCORE_COLORS: Record<string, string> = {
  a: "#038141",
  b: "#85BB2F",
  c: "#FECB02",
  d: "#EE8100",
  e: "#E63E11",
};

export function NutriScoreBadge({ grade, size = "medium" }: NutriScoreBadgeProps) {
  if (!grade) return null;

  const normalizedGrade = grade.toLowerCase();
  const color = NUTRI_SCORE_COLORS[normalizedGrade] || "#999";

  const sizeStyles = {
    small: { fontSize: 12, padding: 4, minWidth: 24 },
    medium: { fontSize: 14, padding: 6, minWidth: 28 },
    large: { fontSize: 16, padding: 8, minWidth: 32 },
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color },
        {
          padding: sizeStyles[size].padding,
          minWidth: sizeStyles[size].minWidth,
        },
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: sizeStyles[size].fontSize }]}>
        {normalizedGrade.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
