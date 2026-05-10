import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { getCategoryItems, type DictionaryItem } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ID = "6";
const CATEGORY_KEY = "Analisis Wacana";

export default function AnalisisWacanaScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).home;
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTitle = useMemo(() => {
    const title = texts.categories.find(
      (category) => category.id === CATEGORY_ID,
    )?.title;
    return title ?? CATEGORY_KEY;
  }, [texts]);

  const categoryItems = useMemo(
    () => getCategoryItems(CATEGORY_KEY, language),
    [language],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return categoryItems;
    }
    return categoryItems.filter(
      (item) =>
        item.name_norm.includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [categoryItems, searchQuery]);

  const handlePress = useCallback(
    (item: DictionaryItem) => {
      router.push({
        pathname: "/home/analisis-wacana/[term]",
        params: { term: item.name_norm },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: DictionaryItem }) => (
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

  const renderSeparator = useCallback(
    () => <View style={styles.cardSeparator} />,
    [],
  );

  const emptyText = searchQuery.trim()
    ? "Istilah tidak ditemukan."
    : "Belum ada data.";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.title}>{categoryTitle}</Text>
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
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.name_norm}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          }
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
  title: {
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
    borderColor: colors.lightGray,
  },
  cardTitle: {
    fontSize: size.medium,
    fontWeight: "700",
    color: colors.black,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: size.small,
    color: colors.gray,
    lineHeight: 18,
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
