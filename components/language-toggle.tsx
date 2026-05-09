import { colors } from "@/constants/Colors";
import { size } from "@/constants/Sizes";
import { Language, useLanguage } from "@/contexts/LanguageContext";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface LanguageToggleProps {
  variant?: "white" | "dark";
  style?: StyleProp<ViewStyle>;
}

const TOGGLE_WIDTH = 64;
const TOGGLE_HEIGHT = 32;
const BORDER_WIDTH = 1;
const THUMB_PADDING = 1;
const THUMB_SIZE = TOGGLE_HEIGHT - BORDER_WIDTH * 2 - THUMB_PADDING * 2;
const MAX_TRANSLATE =
  TOGGLE_WIDTH - BORDER_WIDTH * 2 - THUMB_PADDING * 2 - THUMB_SIZE;

export default function LanguageToggle({
  variant = "white",
  style,
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const slideAnim = useRef(
    new Animated.Value(language === "ID" ? 0 : 1),
  ).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: language === "ID" ? 0 : 1,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start();
  }, [language, slideAnim]);

  const translateX = useMemo(
    () =>
      slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, MAX_TRANSLATE],
      }),
    [slideAnim],
  );

  const handlePress = useCallback(
    (lang: Language) => {
      setLanguage(lang);
    },
    [setLanguage],
  );

  const isWhite = variant === "white";

  return (
    <View
      style={[
        styles.track,
        isWhite ? styles.trackWhite : styles.trackDark,
        style,
      ]}
    >
      {/* Animated thumb */}
      <Animated.View
        style={[
          styles.thumb,
          isWhite ? styles.thumbWhite : styles.thumbDark,
          { transform: [{ translateX }] },
        ]}
      />

      {/* ID label */}
      <TouchableOpacity
        style={styles.labelArea}
        onPress={() => handlePress("ID")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.label,
            language === "ID"
              ? isWhite
                ? styles.labelActiveWhite
                : styles.labelActiveDark
              : isWhite
                ? styles.labelInactiveWhite
                : styles.labelInactiveDark,
          ]}
        >
          ID
        </Text>
      </TouchableOpacity>

      {/* FR label */}
      <TouchableOpacity
        style={styles.labelArea}
        onPress={() => handlePress("FR")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.label,
            language === "FR"
              ? isWhite
                ? styles.labelActiveWhite
                : styles.labelActiveDark
              : isWhite
                ? styles.labelInactiveWhite
                : styles.labelInactiveDark,
          ]}
        >
          FR
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  trackWhite: {
    backgroundColor: "transparent",
    borderWidth: BORDER_WIDTH,
    borderColor: colors.white,
  },
  trackDark: {
    backgroundColor: "transparent",
    borderWidth: BORDER_WIDTH,
    borderColor: colors.primary,
  },
  thumb: {
    position: "absolute",
    left: THUMB_PADDING,
    top: THUMB_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  thumbWhite: {
    backgroundColor: colors.white,
  },
  thumbDark: {
    backgroundColor: colors.primary,
  },
  labelArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 1,
  },
  label: {
    fontSize: size.small,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  labelActiveWhite: {
    color: colors.primary,
  },
  labelInactiveWhite: {
    color: colors.white,
  },
  labelActiveDark: {
    color: colors.white,
  },
  labelInactiveDark: {
    color: colors.primary,
  },
});
