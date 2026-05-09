import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "light";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "light" && styles.buttonLight, style]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "light" && styles.buttonTextLight,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
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
});
