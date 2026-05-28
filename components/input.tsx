import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import { memo, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  autoCorrect?: boolean;
  returnKeyType?: TextInputProps["returnKeyType"];
  inputMode?: TextInputProps["inputMode"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  blurOnSubmit?: TextInputProps["blurOnSubmit"];
}

function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize,
  autoComplete,
  textContentType,
  autoCorrect,
  returnKeyType,
  inputMode,
  onSubmitEditing,
  blurOnSubmit,
}: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            secureTextEntry ? styles.inputWithIcon : undefined,
            error ? styles.inputError : undefined,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          inputMode={inputMode}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setHidden((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Animated.View style={styles.errorContainer}>
          <Text style={styles.errorText} selectable>
            {error}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default memo(Input);

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    width: "100%",
    fontSize: size.small,
    color: colors.black,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  eyeButton: {
    position: "absolute",
    right: spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  errorContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    fontSize: size.extraSmall,
    color: colors.danger,
  },
});
