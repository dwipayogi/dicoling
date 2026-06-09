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
    minHeight: 150,
    // Premium float shadow
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  iconContainer: {
    backgroundColor: colors.secondary,
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  icon: {
    // optional shadow or offset if needed
  },
  title: {
    fontSize: size.medium,
    fontWeight: "800",
    color: colors.black,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: size.small,
    color: colors.gray,
    lineHeight: 18,
    fontWeight: "500",
  },
});
