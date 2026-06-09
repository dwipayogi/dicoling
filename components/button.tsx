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
      activeOpacity={0.8}
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
    backgroundColor: colors.primaryDark,
    height: 52,
    borderRadius: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 4,
  },
  buttonLight: {
    backgroundColor: colors.secondary,
    borderWidth: 1.2,
    borderColor: colors.primaryLight,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: size.medium,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  buttonTextLight: {
    color: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  spinner: {
    marginRight: spacing.sm,
  },
});

