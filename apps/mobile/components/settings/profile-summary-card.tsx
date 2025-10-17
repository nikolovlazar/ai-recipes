import { View, Text, StyleSheet, Pressable } from "react-native";
import type { ProfileResponse } from "@ai-recipes/shared";

interface ProfileSummaryCardProps {
  profile: ProfileResponse | null;
  onEdit: () => void;
}

export function ProfileSummaryCard({ profile, onEdit }: ProfileSummaryCardProps) {
  if (!profile) {
    return (
      <View style={styles.card}>
        <Text style={styles.noProfileText}>No profile found</Text>
        <Pressable style={styles.createButton} onPress={onEdit}>
          <Text style={styles.createButtonText}>Create Profile</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      <View style={styles.content}>
        {profile.diet && (
          <View style={styles.row}>
            <Text style={styles.label}>Diet:</Text>
            <Text style={styles.value}>{profile.diet}</Text>
          </View>
        )}

        {profile.allergies && profile.allergies.length > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Allergies:</Text>
            <Text style={styles.value}>{profile.allergies.join(", ")}</Text>
          </View>
        )}

        {profile.restrictions && profile.restrictions.length > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Restrictions:</Text>
            <Text style={styles.value}>{profile.restrictions.join(", ")}</Text>
          </View>
        )}

        {profile.age && (
          <View style={styles.row}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{profile.age} years</Text>
          </View>
        )}

        {profile.weight && (
          <View style={styles.row}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{profile.weight} kg</Text>
          </View>
        )}

        {profile.goals && (
          <View style={styles.row}>
            <Text style={styles.label}>Goals:</Text>
            <Text style={styles.value}>{profile.goals}</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
    minWidth: 100,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chevron: {
    color: "#fff",
    fontSize: 20,
  },
  noProfileText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
