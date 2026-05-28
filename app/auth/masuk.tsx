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
import { useState } from "react";

export default function Masuk() {
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
    <AuthScreenLayout
      actionLabel={texts.loginButton}
      onAction={handleLogin}
      isLoading={isLoading}
      generalError={generalError}
      footer={
        <AuthFooterLink
          mutedText={texts.noAccount}
          linkText={texts.registerLink}
          href="/auth/daftar"
        />
      }
    >
      <AuthField>
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
      <AuthField>
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
    </AuthScreenLayout>
  );
}
