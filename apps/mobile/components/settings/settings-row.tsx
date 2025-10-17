import { Text, StyleSheet, Pressable } from "react-native";

interface SettingsRowProps {
  title: string;
  icon?: string;
  destructive?: boolean;
  onPress: () => void;
}

export function SettingsRow({
  title,
  icon,
  destructive = false,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={[styles.title, destructive && styles.titleDestructive]}>
        {icon && <Text>{icon} </Text>}
        {title}
      </Text>
      <Text style={[styles.chevron, destructive && styles.chevronDestructive]}>
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    color: "#000",
  },
  titleDestructive: {
    color: "#ff3b30",
  },
  chevron: {
    fontSize: 20,
    color: "#007AFF",
  },
  chevronDestructive: {
    color: "#ff3b30",
  },
});
