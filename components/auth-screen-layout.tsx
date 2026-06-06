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
  const paddingTop = spacing.xxl + (isAndroid ? insets.top : 0);
  const paddingBottom = spacing.xxl + (isAndroid ? insets.bottom : 0);

  // For tablet sizes, constrain form width
  const isTablet = width >= 768;
  const formWidth = isTablet ? 480 : "100%";

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, { paddingTop, paddingBottom }]}
      >
        <BackgroundOrnaments />
        
        <View style={[styles.languageToggle, { top: insets.top + spacing.lg }]}>
          <LanguageToggle variant="dark" />
        </View>

        <View style={[styles.content, { width: formWidth }, isTablet && styles.cardStyle]}>
          <View style={styles.header}>
            <Image
              source={images.appIcon}
              style={styles.logo}
              contentFit="contain"
            />
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
          />

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  // Ornaments
  ornamentCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.05,
    top: -100,
    left: -100,
  },
  ornamentCircle2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.primary,
    opacity: 0.03,
    bottom: -150,
    right: -150,
  },
  ornamentWave: {
    position: "absolute",
    width: 200,
    height: 80,
    backgroundColor: colors.primary,
    opacity: 0.04,
    borderRadius: 40,
    transform: [{ rotate: "-45deg" }],
    top: "30%",
    right: -50,
  },
  cardStyle: {
    backgroundColor: colors.white,
    padding: spacing.xxl,
    borderRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
  },
  languageToggle: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: size.extraLarge,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  appDescription: {
    fontSize: size.medium,
    color: colors.gray,
  },
  errorBanner: {
    width: "100%",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: size.small,
    textAlign: "center",
  },
  field: {
    width: "100%",
  },
  fields: {
    width: "100%",
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.md,
  },
  linkRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  linkTextMuted: {
    color: colors.gray,
  },
  linkTextPrimary: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
