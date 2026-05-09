import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
      <View style={{ position: "absolute", top: insets.top + 16, right: 16 }}>
        <LanguageToggle variant="dark" />
      </View>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Dicoling</Text>
        <Text style={styles.appDescription}>Dictionnaire de Linguistique</Text>
      </View>

      <View style={{ width: "100%", marginBottom: 12 }}>
        <Label text={texts.emailLabel} />
        <Input placeholder={texts.emailPlaceholder} value={email} onChangeText={setEmail} />
      </View>
      <View style={{ width: "100%", marginBottom: 12 }}>
        <Label text={texts.passwordLabel} />
        <Input
          placeholder={texts.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Button title={texts.loginButton} onPress={handleLogin} />
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <Text style={{ color: colors.gray }}>{texts.noAccount}</Text>
        <Link replace href="/auth/daftar">
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>{texts.registerLink}</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
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
});

