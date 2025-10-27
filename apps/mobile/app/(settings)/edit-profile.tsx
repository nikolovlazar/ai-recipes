import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import type { ProfileDto } from "@ai-recipes/shared";
import { TagSelector } from "@/components/forms/tag-selector";
import { UnitInput } from "@/components/forms/unit-input";
import { useProfile } from "@/contexts/ProfileContext";

const DIET_OPTIONS = [
  "None",
  "Vegan",
  "Vegetarian",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Other",
];

const ALLERGY_OPTIONS = [
  "Nuts",
  "Dairy",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Gluten/Wheat",
];

const RESTRICTION_OPTIONS = [
  "Low sodium",
  "Low sugar",
  "Low fat",
  "Low carb",
  "Halal",
  "Kosher",
];

export default function EditProfileScreen() {
  const router = useRouter();
  const {
    profile,
    loading: profileLoading,
    updateProfile: updateProfileContext,
    deleteProfile: deleteProfileContext,
  } = useProfile();

  const [formData, setFormData] = useState<ProfileDto>({
    diet: undefined,
    allergies: [],
    restrictions: [],
    age: undefined,
    weight: undefined,
    goals: undefined,
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        diet: profile.diet || undefined,
        allergies: profile.allergies || [],
        restrictions: profile.restrictions || [],
        age: profile.age || undefined,
        weight: profile.weight || undefined,
        goals: profile.goals || undefined,
      });
    } else if (!profileLoading) {
      Alert.alert("No Profile", "Please create a profile first", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [profile, profileLoading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.age !== undefined) {
      if (formData.age < 1 || formData.age > 120) {
        newErrors.age = "Age must be between 1 and 120";
      }
    }

    if (formData.weight !== undefined) {
      if (formData.weight <= 0) {
        newErrors.weight = "Weight must be greater than 0";
      }
    }

    if (formData.goals && formData.goals.length > 200) {
      newErrors.goals = "Goals must be 200 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      await updateProfileContext(formData);

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
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
      ],
    );
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Dietary Preference */}
        <View style={styles.field}>
          <Text style={styles.label}>Dietary Preference</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.diet || "None"}
              onValueChange={(value) => {
                console.log(`Changing diet from ${formData.diet} to ${value}`);

                setFormData({
                  ...formData,
                  diet: value === "None" ? undefined : value,
                });
              }}
              style={styles.picker}
            >
              {DIET_OPTIONS.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Allergies */}
        <TagSelector
          label="Allergies"
          options={ALLERGY_OPTIONS}
          selected={formData.allergies || []}
          onChange={(allergies) => setFormData({ ...formData, allergies })}
          allowCustom
        />

        {/* Dietary Restrictions */}
        <TagSelector
          label="Dietary Restrictions"
          options={RESTRICTION_OPTIONS}
          selected={formData.restrictions || []}
          onChange={(restrictions) =>
            setFormData({ ...formData, restrictions })
          }
          allowCustom
        />

        {/* Age */}
        <View style={styles.field}>
          <Text style={styles.label}>Age (optional)</Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            value={formData.age?.toString() || ""}
            onChangeText={(text) => {
              const age = text === "" ? undefined : parseInt(text, 10);
              setFormData({ ...formData, age });
              if (errors.age) {
                setErrors({ ...errors, age: "" });
              }
            }}
            placeholder="Your age"
            keyboardType="number-pad"
            returnKeyType="next"
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        {/* Weight */}
        <UnitInput
          label="Weight (optional)"
          value={formData.weight}
          onChange={(weight) => setFormData({ ...formData, weight })}
          units={["kg", "lbs"]}
          defaultUnit="kg"
          placeholder="Your weight"
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

        {/* Health Goals */}
        <View style={styles.field}>
          <Text style={styles.label}>Health Goals (optional)</Text>
          <TextInput
            style={[styles.textArea, errors.goals && styles.inputError]}
            value={formData.goals || ""}
            onChangeText={(text) => {
              setFormData({ ...formData, goals: text });
              if (errors.goals) {
                setErrors({ ...errors, goals: "" });
              }
            }}
            placeholder="e.g., Lose weight, Build muscle, Maintain health"
            multiline
            numberOfLines={3}
            maxLength={200}
            returnKeyType="done"
          />
          {errors.goals && <Text style={styles.errorText}>{errors.goals}</Text>}
          <Text style={styles.characterCount}>
            {formData.goals?.length || 0}/200
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <Pressable
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </Pressable>

      {/* Delete Profile Button */}
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Profile</Text>
      </Pressable>

      <Text style={styles.deleteWarning}>
        Deleting your profile cannot be undone
      </Text>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 150,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3b30",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteWarning: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 20,
  },
  footer: {
    height: 40,
  },
});
