import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface LabelProps {
  text: string;
}

function Label({ text }: LabelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export default memo(Label);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: size.medium,
    fontWeight: "bold",
    color: colors.black,
  },
});
