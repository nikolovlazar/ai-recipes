import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

interface UnitInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  units: string[];
  defaultUnit: string;
  placeholder?: string;
}

export function UnitInput({
  label,
  value,
  onChange,
  units,
  defaultUnit,
  placeholder,
}: UnitInputProps) {
  const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  // Sync inputValue with value prop when it changes
  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  const handleValueChange = (text: string) => {
    setInputValue(text);

    if (text === "") {
      onChange(undefined);
      return;
    }

    const numValue = parseFloat(text);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  const handleUnitToggle = (unit: string) => {
    setSelectedUnit(unit);

    // Convert value if needed (kg <-> lbs)
    if (value && units.includes("kg") && units.includes("lbs")) {
      if (unit === "lbs" && selectedUnit === "kg") {
        // Convert kg to lbs
        const lbsValue = value * 2.20462;
        onChange(parseFloat(lbsValue.toFixed(1)));
        setInputValue(lbsValue.toFixed(1));
      } else if (unit === "kg" && selectedUnit === "lbs") {
        // Convert lbs to kg
        const kgValue = value / 2.20462;
        onChange(parseFloat(kgValue.toFixed(1)));
        setInputValue(kgValue.toFixed(1));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleValueChange}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />

        <View style={styles.unitToggle}>
          {units.map((unit) => (
            <Pressable
              key={unit}
              style={[
                styles.unitButton,
                selectedUnit === unit && styles.unitButtonActive,
              ]}
              onPress={() => handleUnitToggle(unit)}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  selectedUnit === unit && styles.unitButtonTextActive,
                ]}
              >
                {unit}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  unitToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  unitButtonActive: {
    backgroundColor: "#007AFF",
  },
  unitButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  unitButtonTextActive: {
    color: "#fff",
  },
});
