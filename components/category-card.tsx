import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function CategoryCard({
  title,
  description,
  icon = "chatbubble-ellipses-outline",
  onPress,
  style,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={28}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minHeight: 120,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: size.medium,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 4,
  },
  description: {
    fontSize: size.small,
    color: colors.gray,
    lineHeight: 18,
  },
});
