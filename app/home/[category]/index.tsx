import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { getCategorySlug, resolveCategoryFromSlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
	getEntriesByCategoryAndLang,
	searchEntriesByCategoryAndLang,
	type EntryListItem,
} from "@/services/repository";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Abstract/geometric ornaments for background
function BackgroundOrnaments() {
	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="none">
			<View style={styles.ornamentCircle1} />
			<View style={styles.ornamentCircle2} />
		</View>
	);
}

export default function CategoryScreen() {
	const router = useRouter();
	const { language } = useLanguage();
	const texts = t(language).home;
	const { category } = useLocalSearchParams<{
		category?: string | string[];
	}>();
	const [searchQuery, setSearchQuery] = useState("");
	const [items, setItems] = useState<EntryListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const debouncedQuery = useDebouncedValue(searchQuery, 250);

	const categoryValue = useMemo(() => {
		if (!category) {
			return "";
		}
		const raw = Array.isArray(category) ? category[0] : category;
		return decodeURIComponent(raw);
	}, [category]);

	const resolvedCategory = useMemo(
		() => resolveCategoryFromSlug(categoryValue, language),
		[categoryValue, language],
	);

	const categorySlug = useMemo(() => {
		if (categoryValue) {
			return categoryValue;
		}
		return getCategorySlug(resolvedCategory.title);
	}, [categoryValue, resolvedCategory.title]);

	useEffect(() => {
		let isActive = true;
		setIsLoading(true);

		const loadEntries = async () => {
			try {
				const query = debouncedQuery.trim();
				const data = query
					? await searchEntriesByCategoryAndLang({
							category: resolvedCategory.key,
							language,
							query,
						})
					: await getEntriesByCategoryAndLang(
							resolvedCategory.key,
							language,
						);

				if (isActive) {
					setItems(data);
				}
			} catch {
				if (isActive) {
					setItems([]);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		loadEntries();

		return () => {
			isActive = false;
		};
	}, [debouncedQuery, resolvedCategory.key, language]);

	const handlePress = useCallback(
		(item: EntryListItem) => {
			router.push({
				pathname: "/home/[category]/[term]",
				params: { category: categorySlug, term: item.name_norm },
			});
		},
		[categorySlug, router],
	);

	const renderItem = useCallback(
		({ item }: { item: EntryListItem }) => (
			<TouchableOpacity
				style={styles.card}
				onPress={() => handlePress(item)}
				activeOpacity={0.7}
			>
				<Text style={styles.cardTitle}>{item.name}</Text>
				<Text style={styles.cardDescription} numberOfLines={3}>
					{item.desc}
				</Text>
			</TouchableOpacity>
		),
		[handlePress],
	);

	const keyExtractor = useCallback(
		(item: EntryListItem) => `${item.id}-${item.name_norm}`,
		[],
	);

	const renderSeparator = useCallback(
		() => <View style={styles.cardSeparator} />,
		[],
	);

	const loadingText = language === "FR" ? "Chargement..." : "Memuat data...";
	const notFoundText =
		language === "FR" ? "Terme non trouvé." : "Istilah tidak ditemukan.";
	const emptyDataText =
		language === "FR" ? "Aucune donnée." : "Belum ada data.";

	const emptyText = isLoading
		? loadingText
		: searchQuery.trim()
			? notFoundText
			: emptyDataText;

	const { width } = useWindowDimensions();
	const isTablet = width >= 768;

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<BackgroundOrnaments />
			<View style={[styles.header, isTablet && styles.headerTablet]}>
				<Text style={styles.title}>{resolvedCategory.title}</Text>
				<LanguageToggle variant="dark" />
			</View>

			<View style={[styles.content, isTablet && styles.contentTablet]}>
				<SearchBar
					placeholder={texts.searchPlaceholder}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={styles.searchBar}
				/>

				<FlashList
					data={items}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					ItemSeparatorComponent={renderSeparator}
					ListEmptyComponent={
						isLoading ? (
							<View style={styles.emptyState}>
								<ActivityIndicator size="large" color={colors.primary} />
							</View>
						) : (
							<View style={styles.emptyState}>
								<Text style={styles.emptyText}>{emptyText}</Text>
							</View>
						)
					}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.tertiary, // Soft background
	},
	// Ornaments
	ornamentCircle1: {
		position: "absolute",
		width: 300,
		height: 300,
		borderRadius: 150,
		backgroundColor: colors.primary,
		opacity: 0.05,
		top: -100,
		left: -100,
	},
	ornamentCircle2: {
		position: "absolute",
		width: 400,
		height: 400,
		borderRadius: 200,
		backgroundColor: colors.primary,
		opacity: 0.03,
		bottom: -150,
		right: -150,
	},
	header: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
		paddingHorizontal: spacing.xxl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		zIndex: 10,
	},
	headerTablet: {
		paddingHorizontal: "15%",
	},
	title: {
		fontSize: size.title,
		fontWeight: "800",
		color: colors.primary,
	},
	content: {
		flex: 1,
		backgroundColor: colors.white,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		// Shadow for the content area
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 5,
	},
	contentTablet: {
		paddingHorizontal: "15%",
	},
	searchBar: {
		marginBottom: spacing.lg,
	},
	listContent: {
		paddingBottom: spacing.xxl,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.white,
		borderLeftWidth: 4,
		borderLeftColor: colors.primary, // Accent left border
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 2,
	},
	cardTitle: {
		fontSize: size.medium,
		fontWeight: "800",
		color: colors.black,
		marginBottom: spacing.sm,
	},
	cardDescription: {
		fontSize: size.small,
		color: colors.gray,
		lineHeight: 20,
	},
	cardSeparator: {
		height: spacing.md,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: spacing.xl,
	},
	emptyText: {
		fontSize: size.small,
		color: colors.gray,
	},
});
