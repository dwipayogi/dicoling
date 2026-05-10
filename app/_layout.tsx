import { LanguageProvider } from "@/contexts/LanguageContext";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/masuk" options={{ headerShown: false }} />
          <Stack.Screen name="auth/daftar" options={{ headerShown: false }} />
          <Stack.Screen name="home/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="home/[category]/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home/[category]/[term]"
            options={{ headerShown: false }}
          />
        </Stack>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
