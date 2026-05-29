import Button from "@/components/button";
import { colors } from "@/constants/Colors";
import { resolveCategoryFromSlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getEntryDetailByTerm, type EntryDetail } from "@/services/repository";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryDetailScreen() {
	const router = useRouter();
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

	const headerTitle = entry?.name ?? resolvedCategory.title;
	const exampleLabel = language === "FR" ? "Exemple :" : "Contoh:";
	const backLabel = language === "FR" ? "Retour" : "Kembali";
	const loadingText = language === "FR" ? "Chargement..." : "Memuat data...";
	const notFoundText =
		language === "FR" ? "Données non trouvées." : "Data tidak ditemukan.";

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<View style={styles.header}>
				<Text style={styles.title}>{headerTitle}</Text>
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
						<>
							<Text style={styles.description}>{entry.desc}</Text>
							{entry.example ? (
								<View style={styles.exampleSection}>
									<Text style={styles.exampleLabel}>{exampleLabel}</Text>
									<Text style={styles.exampleText}>{entry.example}</Text>
								</View>
							) : null}
						</>
					) : (
						<Text style={styles.notFoundText}>{notFoundText}</Text>
					)}
				</ScrollView>

				<View style={styles.footer}>
					<Button title={backLabel} onPress={() => router.back()} />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	header: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
		paddingHorizontal: spacing.xxl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontSize: size.title,
		fontWeight: "700",
		color: colors.white,
		flex: 1,
		paddingRight: spacing.lg,
	},
	content: {
		flex: 1,
		backgroundColor: colors.white,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xxl,
	},
	scrollContent: {
		paddingBottom: spacing.lg,
	},
	description: {
		fontSize: size.medium,
		color: colors.black,
		lineHeight: 20,
	},
	exampleSection: {
		marginTop: spacing.lg,
	},
	exampleLabel: {
		fontSize: size.medium,
		fontWeight: "700",
		color: colors.black,
		marginBottom: spacing.sm,
	},
	exampleText: {
		fontSize: size.small,
		color: colors.gray,
		lineHeight: 18,
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
});
