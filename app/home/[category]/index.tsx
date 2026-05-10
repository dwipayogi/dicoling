import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import {
  getCategorySlug,
  resolveCategoryFromSlug,
  type DictionaryItem,
} from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).home;
  const { category } = useLocalSearchParams<{
    category?: string | string[];
  }>();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return resolvedCategory.items;
    }
    return resolvedCategory.items.filter(
      (item) =>
        item.name_norm.includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [resolvedCategory.items, searchQuery]);

  const handlePress = useCallback(
    (item: DictionaryItem) => {
      router.push({
        pathname: "/home/[category]/[term]",
        params: { category: categorySlug, term: item.name_norm },
      });
    },
    [categorySlug, router],
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
        <Text style={styles.title}>{resolvedCategory.title}</Text>
        <LanguageToggle variant="white" />
      </View>

      <View style={styles.content}>
        <SearchBar
          placeholder={texts.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />

        <FlashList
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
