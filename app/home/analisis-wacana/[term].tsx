import Button from "@/components/button";
import { colors } from "@/constants/Colors";
import { getCategoryItems } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ID = "6";
const CATEGORY_KEY = "Analisis Wacana";

export default function AnalisisWacanaDetailScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).home;
  const { term } = useLocalSearchParams<{ term?: string | string[] }>();

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

  const termValue = useMemo(() => {
    if (!term) {
      return "";
    }
    return Array.isArray(term) ? term[0] : term;
  }, [term]);

  const selectedItem = useMemo(() => {
    if (!termValue) {
      return undefined;
    }
    const normalized = decodeURIComponent(termValue).toLowerCase();
    return categoryItems.find((item) => item.name_norm === normalized);
  }, [categoryItems, termValue]);

  const headerTitle = selectedItem?.name ?? categoryTitle;

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
