import CategoryCard from "@/components/category-card";
import LanguageToggle from "@/components/language-toggle";
import SearchBar from "@/components/search-bar";
import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { language } = useLanguage();
    const texts = t(language).home;
    const [searchQuery, setSearchQuery] = useState("");

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

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.grid}>
                        {texts.categories.map((category) => (
                            <View key={category.id} style={styles.gridItem}>
                                <CategoryCard
                                    title={category.title}
                                    description={category.description}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
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
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
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
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    searchBar: {
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 14,
    },
    gridItem: {
        width: "48%",
        flexGrow: 1,
        flexBasis: "45%",
    },
});
