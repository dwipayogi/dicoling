import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { memo } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "light";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}

function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerColor = variant === "light" ? colors.primary : colors.white;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "light" && styles.buttonLight,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={spinnerColor}
            style={styles.spinner}
          />
        ) : null}
        <Text
          style={[
            styles.buttonText,
            variant === "light" && styles.buttonTextLight,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(Button);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    width: "100%",
  },
  buttonLight: {
    backgroundColor: colors.white,
  },
  buttonText: {
    color: colors.white,
    fontSize: size.small,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextLight: {
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: spacing.sm,
  },
});
