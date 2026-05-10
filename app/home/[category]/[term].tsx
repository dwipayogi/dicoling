import Button from "@/components/button";
import { colors } from "@/constants/Colors";
import { resolveCategoryFromSlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

  const selectedItem = useMemo(() => {
    if (!termValue) {
      return undefined;
    }
    const normalized = termValue.toLowerCase();
    return resolvedCategory.items.find((item) => item.name_norm === normalized);
  }, [resolvedCategory.items, termValue]);

  const headerTitle = selectedItem?.name ?? resolvedCategory.title;

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
          {selectedItem ? (
            <>
              <Text style={styles.description}>{selectedItem.desc}</Text>
              <View style={styles.exampleSection}>
                <Text style={styles.exampleLabel}>Contoh:</Text>
                <Text style={styles.exampleText}>{selectedItem.example}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.notFoundText}>Data tidak ditemukan.</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Kembali" onPress={() => router.back()} />
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
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
