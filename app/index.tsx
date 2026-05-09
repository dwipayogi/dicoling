import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).landing;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require("../assets/images/UNY.png")}
              style={styles.unyLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.logoBadge}>
            <Ionicons name="book" size={22} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.appTitle}>Dicoling</Text>
        <Text style={styles.appSubtitle}>Dictionnaire de Linguistique</Text>
        <LanguageToggle variant="white" style={styles.languageToggle} />
      </View>

      <View style={styles.imageSection}>
        <Image
          source={require("../assets/images/rektorat.jpg")}
          style={styles.rektoratImage}
          resizeMode="cover"
        />
        <View style={styles.imageTopCurve} pointerEvents="none" />
        <View style={styles.imageBottomCurve} pointerEvents="none" />
      </View>

      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.descriptionText}>
            {texts.description}
          </Text>
        </View>

        <View>
          <Button
            title={texts.enterButton}
            variant="light"
            textStyle={styles.masukButtonText}
            onPress={() => router.replace("/auth/masuk")}
          />

          <Text style={styles.footerText}>
            {texts.footer}
          </Text>
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
  headerSection: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  unyLogo: {
    width: 42,
    height: 42,
  },
  appTitle: {
    fontSize: size.extraLarge,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: size.small,
    color: colors.secondary,
    fontStyle: "italic",
    marginTop: 2,
  },
  languageToggle: {
    marginTop: 12,
  },
  imageSection: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  rektoratImage: {
    width: "100%",
    height: "100%",
  },
  imageTopCurve: {
    position: "absolute",
    top: -36,
    left: -40,
    right: -40,
    height: 72,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  imageBottomCurve: {
    position: "absolute",
    bottom: -36,
    left: -40,
    right: -40,
    height: 72,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 22,
  },
  descriptionText: {
    fontSize: size.small,
    color: colors.white,
    lineHeight: 20,
    textAlign: "left",
    marginBottom: 14,
  },
  masukButtonText: {
    fontSize: size.medium,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: size.extraSmall,
    color: colors.secondary,
    textAlign: "center",
    marginTop: 14,
  },
});
