import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { initKamusDb } from "@/services/repository";
import { SQLiteProvider } from "expo-sqlite";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

function LoadingFallback() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size="large" />
		</View>
	);
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<Suspense fallback={<LoadingFallback />}>
				<SQLiteProvider
					databaseName="kamus.db"
					assetSource={{
						assetId: require("@/assets/db/kamus.db"),
						forceOverwrite: true,
					}}
					onInit={initKamusDb}
					useSuspense
				>
					<LanguageProvider>
						<AuthProvider>
							<Stack>
								<Stack.Screen
									name="index"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="auth/masuk"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="auth/daftar"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="home/index"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="home/[category]/index"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="home/[category]/[term]"
									options={{ headerShown: false }}
								/>
							</Stack>
						</AuthProvider>
					</LanguageProvider>
				</SQLiteProvider>
			</Suspense>
		</SafeAreaProvider>
	);
}
