import {
  AuthField,
  AuthFooterLink,
  AuthScreenLayout,
} from "@/components/auth-screen-layout";
import Input from "@/components/input";
import Label from "@/components/label";
import { t } from "@/constants/Translations";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FieldErrors } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";

export default function Masuk() {
  const router = useRouter();
  const { language } = useLanguage();
  const { login, user, isLoading } = useAuth();
  const texts = t(language).masuk;
  const errorTexts = t(language).errors;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading]);

  function resolveError(key?: string): string | undefined {
    if (!key) return undefined;
    return errorTexts[key as keyof typeof errorTexts] ?? key;
  }

  async function handleLogin() {
    setFieldErrors({});
    setGeneralError("");
    setIsSubmitLoading(true);

    try {
      const result = await login(email, password, rememberMe);

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
      setIsSubmitLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      actionLabel={texts.loginButton}
      onAction={handleLogin}
      isLoading={isSubmitLoading}
      generalError={generalError}
      footer={
        <AuthFooterLink
          mutedText={texts.noAccount}
          linkText={texts.registerLink}
          href="/auth/daftar"
        />
      }
    >
      <AuthField index={0}>
        <Label text={texts.emailLabel} />
        <Input
          placeholder={texts.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          autoCorrect={false}
          inputMode="email"
          returnKeyType="next"
          error={resolveError(fieldErrors.email)}
        />
      </AuthField>
      <AuthField index={1}>
        <Label text={texts.passwordLabel} />
        <Input
          placeholder={texts.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          autoCorrect={false}
          returnKeyType="done"
          error={resolveError(fieldErrors.password)}
        />
      </AuthField>

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          onPress={() => setRememberMe((prev) => !prev)}
          style={styles.checkboxWrapper}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color={colors.white} />
            )}
          </View>
          <Text style={styles.rememberMeText}>{texts.rememberMeLabel}</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    alignSelf: "flex-start",
    paddingHorizontal: 2,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberMeText: {
    fontSize: size.small - 2,
    fontWeight: "600",
    color: colors.gray,
  },
});
