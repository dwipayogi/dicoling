import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { StyleSheet, Text, View } from "react-native";

interface LabelProps {
  text: string;
}

export default function Label({ text }: LabelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: size.medium,
    fontWeight: "bold",
    color: colors.black,
  },
});
