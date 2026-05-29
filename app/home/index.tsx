import CategoryCard from "@/components/category-card";
import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { getCategorySlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useAuth } from "@/contexts/AuthContext";
import type { Language } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
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

type CategoryItem = {
	id: string;
	title: string;
	description: string;
};

const CATEGORIES_BY_LANGUAGE: Record<Language, CategoryItem[]> = {
	ID: [
		{
			id: "1",
			title: "Fonologi",
			description: "Kajian tentang bunyi bahasa",
		},
		{
			id: "2",
			title: "Sintaksis",
			description: "Kajian tentang struktur kalimat",
		},
		{
			id: "3",
			title: "Semantik",
			description: "Kajian tentang makna",
		},
		{
			id: "4",
			title: "Pragmatik",
			description: "Kajian tentang konteks",
		},
		{
			id: "5",
			title: "Morfologi",
			description: "Kajian tentang bentuk dan pembentukan kata.",
		},
		{
			id: "6",
			title: "Analisis Wacana",
			description: "Kajian bahasa dalam konteks teks dan sosial",
		},
	],
	FR: [
		{
			id: "1",
			title: "Phonologie",
			description: "Étude de la phonétique",
		},
		{
			id: "2",
			title: "Syntaxe",
			description: "Étude de la structure de la phrase",
		},
		{
			id: "3",
			title: "Sémantique",
			description: "Étude sur le sens",
		},
		{
			id: "4",
			title: "Pragmatique",
			description: "Analyse du sens dans son contexte",
		},
		{
			id: "5",
			title: "Morphologie",
			description: "Étude de la forme et de la formation des mots",
		},
		{
			id: "6",
			title: "Analyse du discours",
			description: "Étude de la langue dans son contexte textuel et social",
		},
	],
};

export default function HomeScreen() {
	const router = useRouter();
	const { language } = useLanguage();
	const { user } = useAuth();
	const texts = t(language).home;
	const [searchQuery, setSearchQuery] = useState("");
	const categories = CATEGORIES_BY_LANGUAGE[language];

	const greeting = useMemo(() => {
		const timeGreeting = getTimeGreeting(texts);
		const name = user?.name ?? "";
		return name ? `${timeGreeting}, ${name}` : timeGreeting;
	}, [texts, user?.name]);

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

				<FlatList
					data={categories}
					renderItem={renderCategory}
					keyExtractor={keyExtractor}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					columnWrapperStyle={styles.row}
					ItemSeparatorComponent={renderSeparator}
				/>
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
});
