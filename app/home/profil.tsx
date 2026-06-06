import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Abstract/geometric ornaments for background
function BackgroundOrnaments() {
	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="none">
			<View style={styles.ornamentCircle1} />
			<View style={styles.ornamentCircle2} />
		</View>
	);
}

export default function ProfileScreen() {
	const router = useRouter();
	const { language } = useLanguage();
	const { user, logout } = useAuth();
	
	const { width } = useWindowDimensions();
	const isTablet = width >= 768;

	const titleText = language === "FR" ? "Profil" : "Profil";
	const nameLabel = language === "FR" ? "Nom" : "Nama";
	const emailLabel = language === "FR" ? "E-mail" : "Email";
	const settingsTitle = language === "FR" ? "Paramètres" : "Pengaturan";
	const languageLabel = language === "FR" ? "Langue" : "Bahasa";
	const logoutText = language === "FR" ? "Se déconnecter" : "Keluar";

	const handleLogout = () => {
		logout();
		router.replace("/");
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<BackgroundOrnaments />
			
			<View style={[styles.header, isTablet && styles.headerTablet]}>
				<TouchableOpacity
					onPress={() => router.back()}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					style={styles.backButton}
				>
					<Ionicons name="arrow-back" size={28} color={colors.primary} />
				</TouchableOpacity>
				<Text style={styles.title}>{titleText}</Text>
				<View style={styles.headerSpacer} />
			</View>

			<View style={[styles.content, isTablet && styles.contentTablet]}>
				<View style={styles.card}>
					<View style={styles.avatarContainer}>
						<Ionicons name="person" size={40} color={colors.primary} />
					</View>
					<View style={styles.infoContainer}>
						<Text style={styles.infoLabel}>{nameLabel}</Text>
						<Text style={styles.infoValue}>{user?.name || "-"}</Text>
						
						<View style={styles.divider} />
						
						<Text style={styles.infoLabel}>{emailLabel}</Text>
						<Text style={styles.infoValue}>{user?.email || "-"}</Text>
					</View>
				</View>

				<Text style={styles.sectionTitle}>{settingsTitle}</Text>
				
				<View style={styles.card}>
					<View style={styles.settingRow}>
						<View style={styles.settingTextContainer}>
							<Ionicons name="globe-outline" size={24} color={colors.primary} style={styles.settingIcon} />
							<Text style={styles.settingLabel}>{languageLabel}</Text>
						</View>
						<LanguageToggle variant="dark" />
					</View>
				</View>

				<View style={styles.spacer} />

				<View style={styles.footerInfo}>
					<Text style={styles.versionText}>Versi 1.0.0</Text>
					<Text style={styles.creditsText}>Dibuat oleh Tim Universitas Negeri Yogyakarta</Text>
				</View>

				<Button
					title={logoutText}
					onPress={handleLogout}
					style={styles.logoutButton}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.tertiary,
	},
	// Ornaments
	ornamentCircle1: {
		position: "absolute",
		width: 300,
		height: 300,
		borderRadius: 150,
		backgroundColor: colors.primary,
		opacity: 0.05,
		top: -100,
		left: -100,
	},
	ornamentCircle2: {
		position: "absolute",
		width: 400,
		height: 400,
		borderRadius: 200,
		backgroundColor: colors.primary,
		opacity: 0.03,
		bottom: -150,
		right: -150,
	},
	header: {
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
		paddingHorizontal: spacing.xxl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		zIndex: 10,
	},
	headerTablet: {
		paddingHorizontal: "15%",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.white,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	title: {
		fontSize: size.title,
		fontWeight: "800",
		color: colors.primary,
	},
	headerSpacer: {
		width: 40, // Match backButton width to center the title
	},
	content: {
		flex: 1,
		backgroundColor: colors.white,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xxl,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 5,
	},
	contentTablet: {
		paddingHorizontal: "20%",
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: 24,
		padding: spacing.xl,
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.tertiary,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 3,
		alignItems: "center",
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.tertiary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.lg,
	},
	infoContainer: {
		width: "100%",
	},
	infoLabel: {
		fontSize: size.small,
		color: colors.gray,
		marginBottom: 4,
		fontWeight: "600",
	},
	infoValue: {
		fontSize: size.medium,
		color: colors.black,
		fontWeight: "700",
	},
	divider: {
		height: 1,
		backgroundColor: colors.tertiary,
		marginVertical: spacing.md,
		width: "100%",
	},
	sectionTitle: {
		fontSize: size.medium,
		fontWeight: "800",
		color: colors.primary,
		marginTop: spacing.md,
		marginBottom: spacing.md,
		marginLeft: spacing.sm,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
	settingTextContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	settingIcon: {
		marginRight: spacing.sm,
	},
	settingLabel: {
		fontSize: size.medium,
		fontWeight: "700",
		color: colors.black,
	},
	spacer: {
		flex: 1,
	},
	footerInfo: {
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	versionText: {
		fontSize: size.small,
		fontWeight: "700",
		color: colors.lightGray,
	},
	creditsText: {
		fontSize: size.extraSmall,
		color: colors.lightGray,
	},
	logoutButton: {
		marginBottom: spacing.xxl,
		backgroundColor: colors.danger,
		shadowColor: colors.danger,
	},
});
