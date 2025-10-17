import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile-form"
        options={{
          title: "Create Profile",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
