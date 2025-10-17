import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ProfileSummaryCard } from "@/components/settings/profile-summary-card";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsRow } from "@/components/settings/settings-row";
import { useProfile } from "@/contexts/ProfileContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, deleteProfile: deleteProfileContext } = useProfile();

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "This will delete all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProfileContext();
              router.replace("/(onboarding)/welcome");
            } catch (error) {
              Alert.alert("Error", "Failed to delete profile");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileSummaryCard
        profile={profile}
        onEdit={() => router.push("/(settings)/edit-profile")}
      />

      <SettingsSection title="General">
        <SettingsRow
          title="About"
          icon="ℹ️"
          onPress={() => router.push("/(settings)/about")}
        />
      </SettingsSection>

      <SettingsSection title="Advanced">
        <SettingsRow
          title="Reset Profile"
          icon="🔄"
          destructive
          onPress={handleDeleteProfile}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});
