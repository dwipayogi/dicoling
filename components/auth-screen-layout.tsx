import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

export function AuthScreenLayout({
  children,
  actionLabel,
  onAction,
  isLoading = false,
  generalError,
  footer,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const isAndroid = process.env.EXPO_OS === "android";
  const paddingTop = spacing.xxl + (isAndroid ? insets.top : 0);
  const paddingBottom = spacing.xxl + (isAndroid ? insets.bottom : 0);

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.container, { paddingTop, paddingBottom }]}
    >
      <View style={[styles.languageToggle, { top: insets.top + spacing.lg }]}>
        <LanguageToggle variant="dark" />
      </View>
      <View style={styles.content}>
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
  );
}

type AuthFieldProps = {
  children: ReactNode;
};

export function AuthField({ children }: AuthFieldProps) {
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
  content: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
  },
  languageToggle: {
    position: "absolute",
    right: spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: spacing.xs,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: size.extraLarge,
    fontWeight: "700",
    color: colors.primary,
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
  footer: {},
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
