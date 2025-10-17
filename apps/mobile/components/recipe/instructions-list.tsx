import { View, Text, StyleSheet } from "react-native";

interface InstructionsListProps {
  instructions: string[];
}

export function InstructionsList({ instructions }: InstructionsListProps) {
  return (
    <View style={styles.container}>
      {instructions.map((instruction, index) => (
        <View key={index} style={styles.instructionRow}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
          </View>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
