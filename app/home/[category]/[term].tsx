import { colors } from "@/constants/Colors";
import { resolveCategoryFromSlug } from "@/constants/Data";
import { size, spacing } from "@/constants/Sizes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getEntryDetailByTerm, getEntriesByCategoryAndLang, type EntryDetail, type EntryListItem } from "@/services/repository";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, useDerivedValue, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

// Maximum pan boundary relative to content size at current scale
const MAX_PAN_FACTOR = 150;

export default function CategoryDetailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { language } = useLanguage();
	const { category, term } = useLocalSearchParams<{
		category?: string | string[];
		term?: string | string[];
	}>();

	const categoryValue = useMemo(() => {
		if (!category) {
			return "";
		}
		const raw = Array.isArray(category) ? category[0] : category;
		return decodeURIComponent(raw);
	}, [category]);

	const termValue = useMemo(() => {
		if (!term) {
			return "";
		}
		const raw = Array.isArray(term) ? term[0] : term;
		return decodeURIComponent(raw);
	}, [term]);

	const resolvedCategory = useMemo(
		() => resolveCategoryFromSlug(categoryValue, language),
		[categoryValue, language],
	);

	const [entry, setEntry] = useState<EntryDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [siblingEntries, setSiblingEntries] = useState<EntryListItem[]>([]);
	const [isCopied, setIsCopied] = useState(false);

	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);
	const translationX = useSharedValue(0);
	const translationY = useSharedValue(0);
	const savedTranslationX = useSharedValue(0);
	const savedTranslationY = useSharedValue(0);

	// Derived on UI thread — no runOnJS needed for scroll gating
	const isZoomed = useDerivedValue(() => scale.value > 1);

	const clampTranslation = (value: number, s: number): number => {
		'worklet';
		const maxPan = MAX_PAN_FACTOR * (s - 1);
		return Math.max(-maxPan, Math.min(maxPan, value));
	};

	const resetTransform = () => {
		'worklet';
		scale.value = withTiming(1, { duration: 250 });
		translationX.value = withTiming(0, { duration: 250 });
		translationY.value = withTiming(0, { duration: 250 });
		savedScale.value = 1;
		savedTranslationX.value = 0;
		savedTranslationY.value = 0;
	};

	const doubleTapGesture = useMemo(() =>
		Gesture.Tap()
			.numberOfTaps(2)
			.maxDuration(250)
			.onStart(() => {
				'worklet';
				if (scale.value > 1) {
					resetTransform();
				} else {
					scale.value = withTiming(2.2, { duration: 250 });
					savedScale.value = 2.2;
				}
			}),
	[]);

	const pinchGesture = useMemo(() =>
		Gesture.Pinch()
			.onUpdate((event) => {
				'worklet';
				scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 4));
			})
			.onEnd(() => {
				'worklet';
				if (scale.value < 1.1) {
					resetTransform();
				} else {
					savedScale.value = scale.value;
				}
			}),
	[]);

	const panGesture = useMemo(() =>
		Gesture.Pan()
			.minPointers(1)
			.maxPointers(2)
			.onUpdate((event) => {
				'worklet';
				if (scale.value > 1) {
					translationX.value = clampTranslation(
						savedTranslationX.value + event.translationX,
						scale.value,
					);
					translationY.value = clampTranslation(
						savedTranslationY.value + event.translationY,
						scale.value,
					);
				}
			})
			.onEnd(() => {
				'worklet';
				if (scale.value <= 1) {
					translationX.value = withTiming(0, { duration: 200 });
					translationY.value = withTiming(0, { duration: 200 });
					savedTranslationX.value = 0;
					savedTranslationY.value = 0;
				} else {
					savedTranslationX.value = translationX.value;
					savedTranslationY.value = translationY.value;
				}
			}),
	[]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ translateX: translationX.value },
			{ translateY: translationY.value },
		],
	}));

	const gesture = useMemo(() =>
		Gesture.Simultaneous(
			pinchGesture,
			Gesture.Simultaneous(panGesture, doubleTapGesture),
		),
	[pinchGesture, panGesture, doubleTapGesture]);

	const scrollAnimatedProps = useAnimatedProps(() => ({
		scrollEnabled: !isZoomed.value,
	}));

	useEffect(() => {
		let isActive = true;

		const loadEntry = async () => {
			if (!termValue.trim()) {
				if (isActive) {
					setEntry(null);
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);

			try {
				const data = await getEntryDetailByTerm({
					category: resolvedCategory.key,
					language,
					termNorm: termValue,
				});
				if (isActive) {
					setEntry(data);
				}
			} catch {
				if (isActive) {
					setEntry(null);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		loadEntry();

		return () => {
			isActive = false;
		};
	}, [termValue, resolvedCategory.key, language]);

	const termTitle = entry?.name ?? resolvedCategory.title;
	const exampleLabel = language === "FR" ? "Exemple :" : "Contoh:";
	const analysisLabel = language === "FR" ? "Analyse :" : "Analisis:";
	const loadingText = language === "FR" ? "Chargement..." : "Memuat data...";
	const notFoundText =
		language === "FR" ? "Données non trouvées." : "Data tidak ditemukan.";

	useEffect(() => {
		let isActive = true;
		const loadSiblings = async () => {
			if (!resolvedCategory.key) return;
			try {
				const siblings = await getEntriesByCategoryAndLang(resolvedCategory.key, language);
				if (isActive) {
					setSiblingEntries(siblings);
				}
			} catch (err) {
				console.error("Error loading sibling entries:", err);
			}
		};
		loadSiblings();
		return () => {
			isActive = false;
		};
	}, [resolvedCategory.key, language]);

	const currentIndex = useMemo(() => {
		if (!termValue || siblingEntries.length === 0) return -1;
		return siblingEntries.findIndex(
			(item) => item.name_norm === termValue.toLowerCase()
		);
	}, [termValue, siblingEntries]);

	const prevEntry = useMemo(() => {
		if (currentIndex > 0) {
			return siblingEntries[currentIndex - 1];
		}
		return null;
	}, [currentIndex, siblingEntries]);

	const nextEntry = useMemo(() => {
		if (currentIndex !== -1 && currentIndex < siblingEntries.length - 1) {
			return siblingEntries[currentIndex + 1];
		}
		return null;
	}, [currentIndex, siblingEntries]);

	const handleNavigate = (targetTermNorm: string) => {
		router.replace({
			pathname: "/home/[category]/[term]",
			params: { category: categoryValue, term: targetTermNorm },
		});
	};

	const handleCopyAll = async () => {
		if (!entry) return;

		let textToCopy = `${termTitle}\n\n`;
		textToCopy += `${language === "FR" ? "Définition" : "Definisi"}: ${entry.desc}\n`;

		if (entry.example) {
			textToCopy += `\n${language === "FR" ? "Exemple" : "Contoh"}: ${entry.example}\n`;
		}

		if (entry.analysis) {
			textToCopy += `\n${language === "FR" ? "Analyse" : "Analisis"}: ${entry.analysis}\n`;
		}

		await Clipboard.setStringAsync(textToCopy);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={colors.tertiary} />
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						style={styles.headerButton}
					>
						<Ionicons name="arrow-back" size={26} color={colors.primaryDark} />
					</TouchableOpacity>

					{entry && (
						<TouchableOpacity
							onPress={handleCopyAll}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							style={[styles.headerButton, isCopied && styles.copyButtonActive]}
						>
							<Ionicons
								name={isCopied ? "checkmark" : "copy-outline"}
								size={22}
								color={isCopied ? colors.accent : colors.primaryDark}
							/>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.content}>
					<Animated.ScrollView
						animatedProps={scrollAnimatedProps}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={[
							styles.scrollContent,
							{ paddingBottom: 100 + insets.bottom },
						]}
					>
						{isLoading ? (
							<View style={styles.loadingState}>
								<ActivityIndicator size="large" color={colors.primary} />
								<Text style={styles.notFoundText}>{loadingText}</Text>
							</View>
						) : entry ? (
							<GestureDetector gesture={gesture}>
								<Animated.View style={[styles.detailCard, animatedStyle]}>
									<Text selectable style={styles.termTitle}>{termTitle}</Text>
									<Text selectable style={styles.description}>{entry.desc}</Text>
									{entry.example ? (
										<View style={styles.exampleSection}>
											<Text style={styles.exampleLabel}>{exampleLabel}</Text>
											<Text selectable style={styles.exampleText}>{entry.example}</Text>
										</View>
									) : null}

									{entry.analysis ? (
										<View style={styles.analysisSection}>
											<Text style={styles.analysisLabel}>{analysisLabel}</Text>
											<Text selectable style={styles.analysisText}>{entry.analysis}</Text>
										</View>
									) : null}
								</Animated.View>
							</GestureDetector>
						) : (
							<View style={styles.detailCard}>
								<Text style={styles.termTitle}>{termTitle}</Text>
								<Text style={styles.notFoundText}>{notFoundText}</Text>
							</View>
						)}
					</Animated.ScrollView>
				</View>

				<View style={[styles.bottomBar, { bottom: Math.max(insets.bottom, 16) }]}>
					<TouchableOpacity
						style={[styles.navButton, { opacity: prevEntry ? 1 : 0.3 }]}
						onPress={() => prevEntry && handleNavigate(prevEntry.name_norm)}
						disabled={!prevEntry}
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-back" size={28} color={colors.primary} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.homeButton}
						onPress={() => router.push("/home")}
						activeOpacity={0.7}
					>
						<Ionicons name="home" size={22} color={colors.white} />
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.navButton, { opacity: nextEntry ? 1 : 0.3 }]}
						onPress={() => nextEntry && handleNavigate(nextEntry.name_norm)}
						disabled={!nextEntry}
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-forward" size={28} color={colors.primary} />
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
		paddingHorizontal: spacing.xl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		zIndex: 10,
	},
	headerButton: {
		width: 42,
		height: 42,
		borderRadius: 14,
		backgroundColor: colors.white,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 2,
		borderWidth: 1,
		borderColor: colors.lightGray,
	},
	copyButtonActive: {
		borderColor: colors.accent,
		backgroundColor: colors.accentLight,
	},
	termTitle: {
		fontSize: size.title,
		fontWeight: "800",
		color: colors.black,
		marginBottom: spacing.md,
		lineHeight: 28,
	},
	content: {
		flex: 1,
		backgroundColor: colors.tertiary,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xs,
	},
	scrollContent: {
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
	},
	detailCard: {
		backgroundColor: colors.white,
		borderRadius: 20,
		padding: spacing.xl,
		borderWidth: 1,
		borderColor: colors.lightGray,
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.04,
		shadowRadius: 12,
		elevation: 2,
		marginBottom: spacing.md,
	},
	description: {
		fontSize: size.medium,
		color: colors.black,
		lineHeight: 24,
		fontWeight: "500",
	},
	exampleSection: {
		marginTop: spacing.xl,
		backgroundColor: colors.secondary,
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.primaryLight,
	},
	exampleLabel: {
		fontSize: size.small,
		fontWeight: "800",
		color: colors.primaryDark,
		marginBottom: 6,
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	exampleText: {
		fontSize: size.small + 1,
		color: colors.gray,
		lineHeight: 20,
		fontWeight: "500",
	},
	analysisSection: {
		marginTop: spacing.md,
		backgroundColor: colors.accentLight,
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.accent,
	},
	analysisLabel: {
		fontSize: size.small,
		fontWeight: "800",
		color: colors.accent,
		marginBottom: 6,
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	analysisText: {
		fontSize: size.small + 1,
		color: colors.black,
		lineHeight: 20,
		fontWeight: "500",
	},
	notFoundText: {
		fontSize: size.medium,
		color: colors.gray,
		textAlign: "center",
	},
	loadingState: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		gap: 12,
	},
	footer: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
	},
	bottomBar: {
		position: "absolute",
		alignSelf: "center",
		width: 220,
		height: 64,
		backgroundColor: colors.white,
		borderRadius: 32,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		borderWidth: 1,
		borderColor: colors.lightGray,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
		zIndex: 100,
	},
	navButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	homeButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 3,
	},
});
