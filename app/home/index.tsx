import CategoryCard from "@/components/category-card";
import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { getCategorySlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import translations, { t } from "@/constants/Translations";
import { useAuth } from "@/contexts/AuthContext";
import type { Language } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
	searchEntriesByLang,
	type SearchResultItem,
} from "@/services/repository";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getTimeGreeting(texts: {
	greetingMorning: string;
	greetingAfternoon: string;
	greetingEvening: string;
	greetingNight: string;
}): string {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 11) return texts.greetingMorning;
	if (hour >= 11 && hour < 15) return texts.greetingAfternoon;
	if (hour >= 15 && hour < 18) return texts.greetingEvening;
	return texts.greetingNight;
}

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
	"1": "volume-high-outline", // Fonologi — bunyi bahasa
	"2": "git-branch-outline", // Sintaksis — struktur kalimat
	"3": "bulb-outline", // Semantik — makna
	"4": "chatbubbles-outline", // Pragmatik — konteks
	"5": "construct-outline", // Morfologi — pembentukan kata
	"6": "document-text-outline", // Analisis Wacana — teks & wacana
};

type CategoryItem = { id: string; title: string; description: string };

/** Build display name map from DB category keys (Indonesian) to localized titles */
const CATEGORY_DISPLAY_NAMES: Record<Language, Record<string, string>> = {
	ID: Object.fromEntries(
		translations.ID.home.categories.map((c) => {
			const idCat = translations.ID.home.categories.find((ic) => ic.id === c.id);
			return [idCat?.title ?? c.title, c.title];
		}),
	),
	FR: Object.fromEntries(
		translations.FR.home.categories.map((c) => {
			const idCat = translations.ID.home.categories.find((ic) => ic.id === c.id);
			return [idCat?.title ?? c.title, c.title];
		}),
	),
};

export default function HomeScreen() {
	const router = useRouter();
	const { language } = useLanguage();
	const { user } = useAuth();
	const texts = t(language).home;
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedQuery = useDebouncedValue(searchQuery, 250);
	const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const categories: CategoryItem[] = texts.categories as unknown as CategoryItem[];

	const isSearchActive = searchQuery.trim().length > 0;

	const greeting = useMemo(() => {
		const timeGreeting = getTimeGreeting(texts);
		const name = user?.name ?? "";
		return name ? `${timeGreeting}, ${name}` : timeGreeting;
	}, [texts, user?.name]);

	/* ----------------------------- Search effect ----------------------------- */
	useEffect(() => {
		let isActive = true;
		const query = debouncedQuery.trim();

		if (!query) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);

		(async () => {
			try {
				const results = await searchEntriesByLang({ language, query });
				if (isActive) {
					setSearchResults(results);
				}
			} catch {
				if (isActive) {
					setSearchResults([]);
				}
			} finally {
				if (isActive) {
					setIsSearching(false);
				}
			}
		})();

		return () => {
			isActive = false;
		};
	}, [debouncedQuery, language]);

	/* ----------------------------- Category nav ------------------------------ */
	const handleCategoryPress = useCallback(
		(category: { id: string; title: string }) => {
			const slug = getCategorySlug(category.title);
			router.push({
				pathname: "/home/[category]",
				params: { category: slug },
			});
		},
		[router],
	);

	/* ----------------------------- Search result nav ------------------------- */
	const handleResultPress = useCallback(
		(item: SearchResultItem) => {
			const slug = getCategorySlug(item.category);
			router.push({
				pathname: "/home/[category]/[term]",
				params: { category: slug, term: item.name_norm },
			});
		},
		[router],
	);

	/* ----------------------------- Category grid ----------------------------- */
	const renderCategory = useCallback(
		({ item }: { item: CategoryItem }) => (
			<View style={styles.gridItem}>
				<CategoryCard
					title={item.title}
					description={item.description}
					icon={CATEGORY_ICONS[item.id]}
					onPress={() => handleCategoryPress(item)}
				/>
			</View>
		),
		[handleCategoryPress],
	);

	const keyExtractor = useCallback((item: { id: string }) => item.id, []);
	const renderSeparator = useCallback(
		() => <View style={styles.rowSeparator} />,
		[],
	);

	/* ----------------------------- Search results ---------------------------- */
	const getCategoryDisplayName = useCallback(
		(categoryKey: string) => {
			return CATEGORY_DISPLAY_NAMES[language][categoryKey] ?? categoryKey;
		},
		[language],
	);

	const renderSearchResult = useCallback(
		({ item }: { item: SearchResultItem }) => (
			<TouchableOpacity
				style={styles.resultCard}
				onPress={() => handleResultPress(item)}
				activeOpacity={0.7}
			>
				<View style={styles.resultHeader}>
					<Text style={styles.resultTitle} numberOfLines={1}>
						{item.name}
					</Text>
					<View style={styles.categoryBadge}>
						<Text style={styles.categoryBadgeText} numberOfLines={1}>
							{getCategoryDisplayName(item.category)}
						</Text>
					</View>
				</View>
				<Text style={styles.resultDescription} numberOfLines={2}>
					{item.desc}
				</Text>
			</TouchableOpacity>
		),
		[handleResultPress, getCategoryDisplayName],
	);

	const renderResultSeparator = useCallback(
		() => <View style={styles.resultSeparator} />,
		[],
	);

	const resultKeyExtractor = useCallback(
		(item: SearchResultItem) => `${item.id}-${item.name_norm}`,
		[],
	);

	/* ------------------------------- Empty state ----------------------------- */
	const notFoundText =
		language === "FR" ? "Terme non trouvé." : "Istilah tidak ditemukan.";

	const resultCountText = useMemo(() => {
		if (isSearching || !isSearchActive) return "";
		const count = searchResults.length;
		if (language === "FR") {
			return count === 1 ? "1 résultat" : `${count} résultats`;
		}
		return `${count} hasil`;
	}, [isSearching, isSearchActive, searchResults.length, language]);

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<StatusBar barStyle="light-content" backgroundColor={colors.primary} />

			<View style={styles.header}>
				<Text style={styles.greeting}>{greeting}</Text>
				<LanguageToggle variant="white" />
			</View>

			<View style={styles.content}>
				<SearchBar
					placeholder={texts.searchPlaceholder}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={styles.searchBar}
				/>

				{isSearchActive ? (
					/* ----- Search results view ----- */
					<View style={styles.searchResultsContainer}>
						{isSearching ? (
							<View style={styles.emptyState}>
								<ActivityIndicator size="large" color={colors.primary} />
							</View>
						) : searchResults.length > 0 ? (
							<>
								<Text style={styles.resultCount}>{resultCountText}</Text>
								<FlashList
									data={searchResults}
									renderItem={renderSearchResult}
									keyExtractor={resultKeyExtractor}
									showsVerticalScrollIndicator={false}
									contentContainerStyle={styles.resultListContent}
									ItemSeparatorComponent={renderResultSeparator}
									keyboardShouldPersistTaps="handled"
								/>
							</>
						) : (
							<View style={styles.emptyState}>
								<Ionicons
									name="search-outline"
									size={48}
									color={colors.lightGray}
								/>
								<Text style={styles.emptyText}>{notFoundText}</Text>
							</View>
						)}
					</View>
				) : (
					/* ----- Category grid view ----- */
					<FlatList
						data={[...categories]}
						renderItem={renderCategory}
						keyExtractor={keyExtractor}
						numColumns={2}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.listContent}
						columnWrapperStyle={styles.row}
						ItemSeparatorComponent={renderSeparator}
					/>
				)}
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
	greeting: {
		fontSize: size.title,
		fontWeight: "700",
		color: colors.white,
	},
	content: {
		flex: 1,
		backgroundColor: colors.white,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xxl,
	},
	searchBar: {
		marginBottom: spacing.xl,
	},
	listContent: {
		paddingBottom: spacing.xxl,
	},
	gridItem: {
		flexGrow: 1,
		flex: 1,
		maxWidth: "48%",
	},
	row: {
		gap: 14,
	},
	rowSeparator: {
		height: 14,
	},

	/* Search results */
	searchResultsContainer: {
		flex: 1,
	},
	resultCount: {
		fontSize: size.small,
		color: colors.gray,
		marginBottom: spacing.md,
	},
	resultListContent: {
		paddingBottom: spacing.xxl,
	},
	resultCard: {
		backgroundColor: colors.white,
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.lightGray,
	},
	resultHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	resultTitle: {
		fontSize: size.medium,
		fontWeight: "700",
		color: colors.black,
		flexShrink: 1,
	},
	categoryBadge: {
		backgroundColor: colors.secondary,
		borderRadius: 20,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
	},
	categoryBadgeText: {
		fontSize: size.extraSmall,
		fontWeight: "600",
		color: colors.primary,
	},
	resultDescription: {
		fontSize: size.small,
		color: colors.gray,
		lineHeight: 18,
	},
	resultSeparator: {
		height: spacing.md,
	},

	/* Empty state */
	emptyState: {
		alignItems: "center",
		paddingVertical: spacing.xxl,
		gap: spacing.md,
	},
	emptyText: {
		fontSize: size.small,
		color: colors.gray,
	},
});
