import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { images } from "@/constants/Images";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Masuk() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useLanguage();
  const texts = t(language).masuk;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    router.push("/home");
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

      <View style={styles.field}>
        <Label text={texts.emailLabel} />
        <Input
          placeholder={texts.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.field}>
        <Label text={texts.passwordLabel} />
        <Input
          placeholder={texts.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Button title={texts.loginButton} onPress={handleLogin} />
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
  field: {
    width: "100%",
    marginBottom: spacing.md,
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
