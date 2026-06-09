import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { images } from "@/constants/Images";
import { size, spacing } from "@/constants/Sizes";

type AuthScreenLayoutProps = {
  children: ReactNode;
  actionLabel: string;
  onAction: () => void | Promise<void>;
  isLoading?: boolean;
  generalError?: string;
  footer?: ReactNode;
};

// Abstract/geometric ornaments for background
function BackgroundOrnaments() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.ornamentCircle1} />
      <View style={styles.ornamentCircle2} />
      <View style={styles.ornamentWave} />
    </View>
  );
}

export function AuthScreenLayout({
  children,
  actionLabel,
  onAction,
  isLoading = false,
  generalError,
  footer,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isAndroid = process.env.EXPO_OS === "android";
  const paddingTop = spacing.xxxl + (isAndroid ? insets.top : 0);
  const paddingBottom = spacing.xxxl + (isAndroid ? insets.bottom : 0);

  // Constrain width
  const isTablet = width >= 768;
  const formWidth = isTablet ? 460 : "100%";

  const Container = isAndroid ? KeyboardAvoidingView : View;
  const containerProps = isAndroid
    ? { behavior: "padding" as const, style: styles.flex }
    : { style: styles.flex };

  return (
    <Container {...containerProps}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          contentContainerStyle={[styles.container, { paddingTop, paddingBottom }]}
        >
          <BackgroundOrnaments />
          
          <View style={[styles.languageToggle, { top: insets.top + spacing.lg }]}>
            <LanguageToggle variant="white" />
          </View>

          <View style={[styles.content, { width: formWidth }, styles.cardStyle]}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image
                  source={images.appIcon}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.appName}>Dicoling</Text>
              <Text style={styles.appDescription}>
                Dictionnaire de Linguistique
              </Text>
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText} selectable>
                  {generalError}
                </Text>
              </View>
            ) : null}

            <View style={styles.fields}>{children}</View>

            <Button
              title={actionLabel}
              onPress={onAction}
              disabled={isLoading}
              loading={isLoading}
              style={styles.actionButton}
            />

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </LinearGradient>
    </Container>
  );
}

type AuthFieldProps = {
  children: ReactNode;
  index?: number;
};

export function AuthField({ children, index = 0 }: AuthFieldProps) {
  return <View style={styles.field}>{children}</View>;
}

type AuthFooterLinkProps = {
  mutedText: string;
  linkText: string;
  href: Href;
  replace?: boolean;
};

export function AuthFooterLink({
  mutedText,
  linkText,
  href,
  replace = true,
}: AuthFooterLinkProps) {
  return (
    <View style={styles.linkRow}>
      <Text style={styles.linkTextMuted}>{mutedText}</Text>
      <Link replace={replace} href={href}>
        <Text style={styles.linkTextPrimary}>{linkText}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  // Ornaments
  ornamentCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.white,
    opacity: 0.05,
    top: -100,
    left: -100,
  },
  ornamentCircle2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.white,
    opacity: 0.04,
    bottom: -150,
    right: -150,
  },
  ornamentWave: {
    position: "absolute",
    width: 240,
    height: 90,
    backgroundColor: colors.white,
    opacity: 0.04,
    borderRadius: 45,
    transform: [{ rotate: "-45deg" }],
    top: "25%",
    right: -60,
  },
  cardStyle: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xxl + spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
    width: "100%",
  },
  languageToggle: {
    position: "absolute",
    right: spacing.xl,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  logo: {
    width: 44,
    height: 44,
  },
  appName: {
    fontSize: size.extraLarge - 2,
    fontWeight: "800",
    color: colors.black,
    letterSpacing: 0.5,
  },
  appDescription: {
    fontSize: size.medium,
    color: colors.gray,
    fontWeight: "500",
  },
  errorBanner: {
    width: "100%",
    backgroundColor: "#FEF2F2",
    borderWidth: 1.2,
    borderColor: "#FECACA",
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: size.small,
    textAlign: "center",
    fontWeight: "600",
  },
  field: {
    width: "100%",
  },
  fields: {
    width: "100%",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: spacing.md,
  },
  linkRow: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  linkTextMuted: {
    color: colors.gray,
    fontSize: size.small,
    fontWeight: "500",
  },
  linkTextPrimary: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: size.small,
  },
});
