import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { images } from "@/constants/Images";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FieldErrors } from "@/services/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Masuk() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useLanguage();
  const { login } = useAuth();
  const texts = t(language).masuk;
  const errorTexts = t(language).errors;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function resolveError(key?: string): string | undefined {
    if (!key) return undefined;
    return errorTexts[key as keyof typeof errorTexts] ?? key;
  }

  async function handleLogin() {
    setFieldErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        return;
      }

      if (result.generalError) {
        setGeneralError(
          resolveError(result.generalError) ?? result.generalError,
        );
        return;
      }

      if (result.success) {
        router.replace("/home");
      }
    } catch {
      setGeneralError(errorTexts.unknownError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.languageToggle, { top: insets.top + spacing.lg }]}>
        <LanguageToggle variant="dark" />
      </View>
      <View style={styles.header}>
        <Image
          source={images.appIcon}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Dicoling</Text>
        <Text style={styles.appDescription}>Dictionnaire de Linguistique</Text>
      </View>

      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      <View style={styles.field}>
        <Label text={texts.emailLabel} />
        <Input
          placeholder={texts.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={resolveError(fieldErrors.email)}
        />
      </View>
      <View style={styles.field}>
        <Label text={texts.passwordLabel} />
        <Input
          placeholder={texts.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={resolveError(fieldErrors.password)}
        />
      </View>

      <Button
        title={isLoading ? "" : texts.loginButton}
        onPress={handleLogin}
        style={isLoading ? styles.buttonLoading : undefined}
      />
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.white}
          style={styles.spinner}
        />
      ) : null}

      <View style={styles.linkRow}>
        <Text style={styles.linkTextMuted}>{texts.noAccount}</Text>
        <Link replace href="/auth/daftar">
          <Text style={styles.linkTextPrimary}>{texts.registerLink}</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  languageToggle: {
    position: "absolute",
    right: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
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
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: size.small,
    textAlign: "center",
  },
  field: {
    width: "100%",
    marginBottom: spacing.md,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  spinner: {
    position: "absolute",
    alignSelf: "center",
  },
  linkRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
  linkTextMuted: {
    color: colors.gray,
  },
  linkTextPrimary: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
