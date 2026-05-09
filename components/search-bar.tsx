import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SearchBar({
  placeholder = "Cari istilah...",
  value,
  onChangeText,
  style,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.gray}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.lightGray}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: size.medium,
    color: colors.black,
    padding: 0,
  },
});
