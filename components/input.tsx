import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { StyleSheet, TextInput } from "react-native";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    fontSize: size.small,
    color: colors.black,
  },
});
