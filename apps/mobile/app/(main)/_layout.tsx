import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MainLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="search"
        options={{
          title: "Search Products",
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(settings)")}
              style={{ marginLeft: 6 }}
            >
              <IconSymbol name="gearshape.fill" size={24} color="#007AFF" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="analysis"
        options={{
          title: "Analysis",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="recipe"
        options={{
          title: "Recipe",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
