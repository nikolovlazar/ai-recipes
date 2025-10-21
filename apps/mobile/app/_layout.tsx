import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { isRunningInExpoGo } from "expo";
import { Stack, useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ProfileProvider } from "@/contexts/ProfileContext";
import * as Sentry from "@sentry/react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo,
});

Sentry.init({
  dsn: "https://fa3818be6142876a5b37540e8e55f3d7@o4506044970565632.ingest.us.sentry.io/4510222714077184",

  enableUserInteractionTracing: true,
  tracesSampleRate: 1.0, // Capture 100% of transactions for development
  enableNativeFramesTracking: !isRunningInExpoGo, // Track slow/frozen frames

  sendDefaultPii: true,

  enableLogs: true,

  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,

  profilesSampleRate: 1.0,

  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  debug: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="(settings)" options={{ presentation: "modal" }} />
        </Stack>
        <StatusBar style="auto" />
      </ProfileProvider>
    </ThemeProvider>
  );
});

