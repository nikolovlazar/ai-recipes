import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useState } from "react";

interface TagSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allowCustom?: boolean;
}

export function TagSelector({
  label,
  options,
  selected,
  onChange,
  allowCustom = false,
}: TagSelectorProps) {
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const addCustom = () => {
    if (customValue.trim()) {
      onChange([...selected, customValue.trim()]);
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Pressable
              key={option}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggleOption(option)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}

        {/* Custom options that were added */}
        {selected
          .filter((item) => !options.includes(item))
          .map((customOption) => (
            <Pressable
              key={customOption}
              style={[styles.option, styles.optionSelected]}
              onPress={() => toggleOption(customOption)}
            >
              <Text style={[styles.optionText, styles.optionTextSelected]}>
                {customOption}
              </Text>
            </Pressable>
          ))}

        {/* Add Custom Button */}
        {allowCustom && !showCustomInput && (
          <Pressable
            style={styles.addCustomButton}
            onPress={() => setShowCustomInput(true)}
          >
            <Text style={styles.addCustomText}>+ Add custom</Text>
          </Pressable>
        )}
      </View>

      {/* Custom Input */}
      {showCustomInput && (
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            value={customValue}
            onChangeText={setCustomValue}
            placeholder="Enter custom option"
            returnKeyType="done"
            onSubmitEditing={addCustom}
            autoFocus
          />
          <Pressable style={styles.addButton} onPress={addCustom}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              setShowCustomInput(false);
              setCustomValue("");
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      )}
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  addCustomButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderStyle: "dashed",
  },
  addCustomText: {
    fontSize: 14,
    color: "#007AFF",
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
