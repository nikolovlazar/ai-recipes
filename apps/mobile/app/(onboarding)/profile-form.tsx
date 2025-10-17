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
import { useState } from "react";
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

export default function ProfileFormScreen() {
  const router = useRouter();
  const { createProfile: createProfileContext } = useProfile();

  const [formData, setFormData] = useState<ProfileDto>({
    diet: undefined,
    allergies: [],
    restrictions: [],
    age: undefined,
    weight: undefined,
    goals: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Filter out empty values
      const submitData: ProfileDto = {};
      if (formData.diet && formData.diet !== "None") {
        submitData.diet = formData.diet;
      }
      if (formData.allergies && formData.allergies.length > 0) {
        submitData.allergies = formData.allergies;
      }
      if (formData.restrictions && formData.restrictions.length > 0) {
        submitData.restrictions = formData.restrictions;
      }
      if (formData.age !== undefined) {
        submitData.age = formData.age;
      }
      if (formData.weight !== undefined) {
        submitData.weight = formData.weight;
      }
      if (formData.goals) {
        submitData.goals = formData.goals;
      }

      await createProfileContext(submitData);

      // Navigate to main screen
      router.replace("/(main)/search");
    } catch (err: any) {
      console.error("Profile creation error:", err);

      let errorMessage = "Failed to create profile. Please try again.";

      if (err.status === 409) {
        errorMessage = "You already have a profile. Redirecting...";
        // Profile exists, just navigate to main screen
        setTimeout(() => router.replace("/(main)/search"), 2000);
      } else if (err.status === 0) {
        errorMessage =
          "Unable to connect. Check your internet connection and try again.";
      }

      Alert.alert("Error", errorMessage, [
        {
          text: "Retry",
          onPress: () => handleSubmit(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>All fields are optional</Text>
      </View>

      <View style={styles.form}>
        {/* Dietary Preference */}
        <View style={styles.field}>
          <Text style={styles.label}>Dietary Preference</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.diet || "None"}
              onValueChange={(value) =>
                setFormData({ ...formData, diet: value })
              }
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

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Create profile"
        accessibilityState={{ disabled: loading }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Profile</Text>
        )}
      </Pressable>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    height: 40,
  },
});
