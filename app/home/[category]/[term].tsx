import Button from "@/components/button";
import { colors } from "@/constants/Colors";
import { resolveCategoryFromSlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getEntryDetailByTerm, type EntryDetail } from "@/services/repository";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryDetailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { language } = useLanguage();
	const { category, term } = useLocalSearchParams<{
		category?: string | string[];
		term?: string | string[];
	}>();

	const categoryValue = useMemo(() => {
		if (!category) {
			return "";
		}
		const raw = Array.isArray(category) ? category[0] : category;
		return decodeURIComponent(raw);
	}, [category]);

	const termValue = useMemo(() => {
		if (!term) {
			return "";
		}
		const raw = Array.isArray(term) ? term[0] : term;
		return decodeURIComponent(raw);
	}, [term]);

	const resolvedCategory = useMemo(
		() => resolveCategoryFromSlug(categoryValue, language),
		[categoryValue, language],
	);

	const [entry, setEntry] = useState<EntryDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isActive = true;

		const loadEntry = async () => {
			if (!termValue.trim()) {
				if (isActive) {
					setEntry(null);
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);

			try {
				const data = await getEntryDetailByTerm({
					category: resolvedCategory.key,
					language,
					termNorm: termValue,
				});
				if (isActive) {
					setEntry(data);
				}
			} catch {
				if (isActive) {
					setEntry(null);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		loadEntry();

		return () => {
			isActive = false;
		};
	}, [termValue, resolvedCategory.key, language]);

	const termTitle = entry?.name ?? resolvedCategory.title;
	const exampleLabel = language === "FR" ? "Exemple :" : "Contoh:";
	const backLabel = language === "FR" ? "Retour" : "Kembali";
	const loadingText = language === "FR" ? "Chargement..." : "Memuat data...";
	const notFoundText =
		language === "FR" ? "Données non trouvées." : "Data tidak ditemukan.";

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={colors.tertiary} />
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={26} color={colors.primaryDark} />
					</TouchableOpacity>
				</View>

				<View style={styles.content}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{isLoading ? (
							<View style={styles.loadingState}>
								<ActivityIndicator size="large" color={colors.primary} />
								<Text style={styles.notFoundText}>{loadingText}</Text>
							</View>
						) : entry ? (
							<View style={styles.detailCard}>
								<Text style={styles.termTitle}>{termTitle}</Text>
								<Text style={styles.description}>{entry.desc}</Text>
								{entry.example ? (
									<View style={styles.exampleSection}>
										<Text style={styles.exampleLabel}>{exampleLabel}</Text>
										<Text style={styles.exampleText}>{entry.example}</Text>
									</View>
								) : null}
							</View>
						) : (
							<View style={styles.detailCard}>
								<Text style={styles.termTitle}>{termTitle}</Text>
								<Text style={styles.notFoundText}>{notFoundText}</Text>
							</View>
						)}
					</ScrollView>
				</View>

				<TouchableOpacity
					style={[styles.floatingHomeButton, { bottom: 20 + insets.bottom }]}
					onPress={() => router.push("/home")}
					activeOpacity={0.8}
				>
					<Ionicons name="home" size={24} color={colors.white} />
				</TouchableOpacity>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
		paddingHorizontal: spacing.xl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		zIndex: 10,
	},
	backButton: {
		width: 42,
		height: 42,
		borderRadius: 14,
		backgroundColor: colors.white,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 2,
		borderWidth: 1,
		borderColor: colors.lightGray,
	},
	termTitle: {
		fontSize: size.title,
		fontWeight: "800",
		color: colors.black,
		marginBottom: spacing.md,
		lineHeight: 28,
	},
	content: {
		flex: 1,
		backgroundColor: colors.tertiary,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xs,
	},
	scrollContent: {
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
	},
	detailCard: {
		backgroundColor: colors.white,
		borderRadius: 20,
		padding: spacing.xl,
		borderWidth: 1,
		borderColor: colors.lightGray,
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.04,
		shadowRadius: 12,
		elevation: 2,
		marginBottom: spacing.md,
	},
	description: {
		fontSize: size.medium,
		color: colors.black,
		lineHeight: 24,
		fontWeight: "500",
	},
	exampleSection: {
		marginTop: spacing.xl,
		backgroundColor: colors.secondary,
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.primaryLight,
	},
	exampleLabel: {
		fontSize: size.small,
		fontWeight: "800",
		color: colors.primaryDark,
		marginBottom: 6,
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	exampleText: {
		fontSize: size.small + 1,
		color: colors.gray,
		lineHeight: 20,
		fontWeight: "500",
	},
	notFoundText: {
		fontSize: size.medium,
		color: colors.gray,
		textAlign: "center",
	},
	loadingState: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		gap: 12,
	},
	footer: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
	},
	floatingHomeButton: {
		position: "absolute",
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 5,
		zIndex: 999,
	},
});
