import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { images } from "@/constants/Images";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

function GabunganOrnaments() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.ornamentCirclePrimary} />
      <View style={styles.ornamentCircleSecondary} />
      <View style={styles.ornamentWave} />
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).landing;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.container}>
      <GabunganOrnaments />
      <View style={styles.contentWrapper}>
        <Animated.View
          entering={FadeInDown.delay(100).duration(800)}
          style={[styles.headerSection, isTablet && styles.headerTablet]}
        >
          <View style={styles.headerTop}>
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
            <LanguageToggle variant="white" style={styles.languageToggle} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>Dicoling</Text>
            <Text style={styles.appSubtitle}>Dictionnaire de Linguistique</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(1000)}
          style={[styles.imageSection, isTablet && styles.imageTablet]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={images.rektorat}
              style={styles.rektoratImage}
              contentFit="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).duration(800)}
          style={[styles.bottomSection, isTablet && styles.bottomTablet]}
        >
          <Text style={styles.descriptionText}>{texts.description}</Text>

          <View style={styles.actionContainer}>
            <Button
              title={texts.enterButton}
              variant="light"
              textStyle={styles.masukButtonText}
              onPress={() => router.replace("/auth/masuk")}
            />
            <Text style={styles.footerText}>{texts.footer}</Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  // Ornaments
  ornamentCirclePrimary: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.white,
    opacity: 0.05,
    top: -150,
    right: -150,
  },
  ornamentCircleSecondary: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.tertiary,
    opacity: 0.1,
    bottom: "20%",
    left: -100,
  },
  ornamentWave: {
    position: "absolute",
    width: "150%",
    height: 300,
    backgroundColor: colors.white,
    opacity: 0.03,
    transform: [{ rotate: "-15deg" }],
    top: "40%",
    left: "-25%",
  },
  headerSection: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    zIndex: 10,
  },
  headerTablet: {
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  unyLogo: {
    width: 44,
    height: 44,
  },
  appLogo: {
    width: 34,
    height: 34,
  },
  languageToggle: {
    marginTop: 0,
  },
  titleContainer: {
    marginTop: spacing.xl,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: size.medium,
    color: colors.tertiary,
    fontStyle: "italic",
    marginTop: 4,
    fontWeight: "500",
  },
  imageSection: {
    flex: 1,
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  imageTablet: {
    paddingHorizontal: "20%",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  rektoratImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 96, 222, 0.1)", // Very subtle primary tint
  },
  bottomSection: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
  },
  bottomTablet: {
    alignItems: "center",
    paddingHorizontal: "25%",
  },
  descriptionText: {
    fontSize: size.medium,
    color: colors.white,
    lineHeight: 24,
    textAlign: "left",
    marginBottom: spacing.xl,
    opacity: 0.9,
  },
  actionContainer: {
    width: "100%",
  },
  masukButtonText: {
    fontSize: size.medium,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: size.extraSmall,
    color: colors.tertiary,
    textAlign: "center",
    marginTop: spacing.md,
    opacity: 0.8,
  },
});
