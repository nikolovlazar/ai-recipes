import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
