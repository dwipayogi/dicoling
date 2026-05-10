import CategoryCard from "@/components/category-card";
import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { getCategorySlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).home;
  const [searchQuery, setSearchQuery] = useState("");
  const categories = texts.categories;

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
    ({
      item,
    }: {
      item: { id: string; title: string; description: string };
    }) => (
      <View style={styles.gridItem}>
        <CategoryCard
          title={item.title}
          description={item.description}
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
        <Text style={styles.greeting}>{texts.greeting}</Text>
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
