import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function CategoryCard({
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
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={28}
          color={colors.primary}
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    flex: 1,
    minHeight: 140,
    // Modern floating shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  iconContainer: {
    backgroundColor: colors.tertiary,
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  icon: {
    // optional shadow or offset if needed
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
