import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { images } from "@/constants/Images";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
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
              source={images.unyLogo}
              style={styles.unyLogo}
              contentFit="contain"
            />
          </View>
          <View style={styles.logoBadge}>
            <Image
              source={images.appIcon}
              style={styles.appLogo}
              contentFit="contain"
            />
          </View>
        </View>
        <Text style={styles.appTitle}>Dicoling</Text>
        <Text style={styles.appSubtitle}>Dictionnaire de Linguistique</Text>
        <LanguageToggle variant="white" style={styles.languageToggle} />
      </View>

      <View style={styles.imageSection}>
        <Image
          source={images.rektorat}
          style={styles.rektoratImage}
          contentFit="cover"
        />
        <View style={styles.imageTopCurve} pointerEvents="none" />
        <View style={styles.imageBottomCurve} pointerEvents="none" />
      </View>

      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.descriptionText}>{texts.description}</Text>
        </View>

        <View>
          <Button
            title={texts.enterButton}
            variant="light"
            textStyle={styles.masukButtonText}
            onPress={() => router.replace("/auth/masuk")}
          />

          <Text style={styles.footerText}>{texts.footer}</Text>
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
    gap: spacing.md,
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
  appLogo: {
    width: 32,
    height: 32,
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
    marginTop: spacing.md,
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
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
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
