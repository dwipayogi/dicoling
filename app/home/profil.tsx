import Button from "@/components/button";
import LanguageToggle from "@/components/language-toggle";
import { colors } from "@/constants/Colors";
import { size, spacing } from "@/constants/Sizes";
import { t } from "@/constants/Translations";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import Input from "@/components/input";

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
	const navigation = useNavigation();
	const { language } = useLanguage();
	const { user, logout, updateProfileImage, updateProfile } = useAuth();
	
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(user?.name || "");
	const [editEmail, setEditEmail] = useState(user?.email || "");
	const [editPassword, setEditPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
	const [generalError, setGeneralError] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const { width } = useWindowDimensions();
	const isTablet = width >= 768;
	const insets = useSafeAreaInsets();
	const {
		titleText,
		nameLabel,
		emailLabel,
		settingsTitle,
		languageLabel,
		logoutText,
		versionText,
		creditsText,
		uploadTitle,
		uploadDesc,
		cameraOption,
		galleryOption,
		deleteOption,
		cancelOption,
		cameraPermissionTitle,
		cameraPermissionMessage,
		editProfileTitle,
		saveButton,
		editButton,
		cancelButton,
		successUpdateMessage,
		errorUpdateMessage,
		passwordLabel,
		passwordPlaceholder,
	} = t(language).profil;

	const errorTexts = t(language).errors;
	const resolveError = (key?: string): string | undefined => {
		if (!key) return undefined;
		return errorTexts[key as keyof typeof errorTexts] ?? key;
	};

	useEffect(() => {
		if (user) {
			setEditName(user.name);
			setEditEmail(user.email);
		}
	}, [user]);

	const handleCancelEdit = () => {
		if (user) {
			setEditName(user.name);
			setEditEmail(user.email);
		}
		setEditPassword("");
		setFieldErrors({});
		setGeneralError("");
		setIsEditing(false);
	};

	const handleSaveEdit = async () => {
		setFieldErrors({});
		setGeneralError("");
		setIsSaving(true);
		try {
			const result = await updateProfile(editName, editEmail, editPassword || undefined);
			if (result.success) {
				setEditPassword("");
				setIsEditing(false);
				Alert.alert(
					language === "ID" ? "Sukses" : "Succès",
					successUpdateMessage
				);
			} else {
				if (result.fieldErrors) {
					setFieldErrors(result.fieldErrors);
				}
				if (result.generalError) {
					const errorText = errorTexts[result.generalError as keyof typeof errorTexts] || result.generalError;
					setGeneralError(errorText);
				}
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setGeneralError(errorUpdateMessage);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRemoveImage = async () => {
		try {
			if (!user) return;
			if (user.profileImageUri) {
				await FileSystem.deleteAsync(user.profileImageUri, { idempotent: true });
			}
			await updateProfileImage(null);
		} catch (error) {
			console.error("Error removing image:", error);
			Alert.alert("Error", language === "ID" ? "Gagal menghapus foto." : "Échec de la suppression de la photo.");
		}
	};

	const saveImageLocally = async (uri: string) => {
		try {
			if (!user) return;
			
			if (user.profileImageUri) {
				try {
					await FileSystem.deleteAsync(user.profileImageUri, { idempotent: true });
				} catch (err) {
					console.warn("Failed to delete old image file:", err);
				}
			}

			const filename = `profile_${user.id}_${Date.now()}.jpg`;
			const destUri = `${FileSystem.documentDirectory}${filename}`;

			await FileSystem.copyAsync({
				from: uri,
				to: destUri,
			});

			await updateProfileImage(destUri);
		} catch (error) {
			console.error("Error saving image locally:", error);
			Alert.alert("Error", language === "ID" ? "Gagal menyimpan foto secara lokal." : "Échec de l'enregistrement local de la photo.");
		}
	};

	const handleLaunchCamera = async () => {
		try {
			const { status } = await ImagePicker.requestCameraPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(cameraPermissionTitle, cameraPermissionMessage);
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (!result.canceled && result.assets?.[0]?.uri) {
				await saveImageLocally(result.assets[0].uri);
			}
		} catch (error) {
			console.error("Error launching camera:", error);
			Alert.alert("Error", language === "ID" ? "Gagal mengambil foto." : "Échec de la prise de photo.");
		}
	};

	const handleLaunchGallery = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (!result.canceled && result.assets?.[0]?.uri) {
				await saveImageLocally(result.assets[0].uri);
			}
		} catch (error) {
			console.error("Error launching image library:", error);
			Alert.alert("Error", language === "ID" ? "Gagal memilih foto." : "Échec du choix de la photo.");
		}
	};

	const handleSelectImage = async () => {
		const options = [
			cameraOption,
			galleryOption,
			...(user?.profileImageUri ? [deleteOption] : []),
			cancelOption,
		];

		Alert.alert(
			uploadTitle,
			uploadDesc,
			options.map((option) => {
				const isCancel = option === cancelOption;
				const isDelete = option === deleteOption;
				return {
					text: option,
					style: isCancel ? "cancel" : isDelete ? "destructive" : "default",
					onPress: async () => {
						if (isCancel) return;
						if (isDelete) {
							await handleRemoveImage();
						} else if (option === cameraOption) {
							await handleLaunchCamera();
						} else if (option === galleryOption) {
							await handleLaunchGallery();
						}
					},
				};
			})
		);
	};

	const handleLogout = () => {
		logout();
		(navigation as any).reset({
			index: 0,
			routes: [{ name: "index" }],
		});
	};

	return (
		<LinearGradient
			colors={[colors.primary, colors.primaryDark]}
			style={styles.container}
		>
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				<BackgroundOrnaments />
				
				<View style={[styles.header, isTablet && styles.headerTablet]}>
					<TouchableOpacity
						onPress={() => router.back()}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={26} color={colors.primaryDark} />
					</TouchableOpacity>
					<Text style={styles.title}>{titleText}</Text>
					<View style={styles.headerSpacer} />
				</View>

				<ScrollView
					style={styles.content}
					contentContainerStyle={[
						styles.scrollContent,
						isTablet && styles.scrollContentTablet,
						{ paddingBottom: insets.bottom }
					]}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.card}>
						<TouchableOpacity onPress={handleSelectImage} style={styles.avatarContainer} activeOpacity={0.8}>
							{user?.profileImageUri ? (
								<Image
									source={{ uri: user.profileImageUri }}
									style={styles.avatarImage}
								/>
							) : (
								<Ionicons name="person" size={40} color={colors.primaryDark} />
							)}
							<View style={styles.editIconContainer}>
								<Ionicons name="camera" size={14} color={colors.white} />
							</View>
						</TouchableOpacity>
						{isEditing ? (
							<View style={styles.infoContainer}>
								<Text style={[styles.infoLabel, { marginBottom: 8 }]}>{nameLabel}</Text>
								<Input
									placeholder={nameLabel}
									value={editName}
									onChangeText={setEditName}
									autoCapitalize="words"
									autoCorrect={false}
									error={resolveError(fieldErrors.name)}
								/>
								
								<View style={{ height: 12 }} />
								
								<Text style={[styles.infoLabel, { marginBottom: 8 }]}>{emailLabel}</Text>
								<Input
									placeholder={emailLabel}
									value={editEmail}
									onChangeText={setEditEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
									error={resolveError(fieldErrors.email)}
								/>

								<View style={{ height: 12 }} />
								
								<Text style={[styles.infoLabel, { marginBottom: 8 }]}>{passwordLabel}</Text>
								<Input
									placeholder={passwordPlaceholder}
									value={editPassword}
									onChangeText={setEditPassword}
									secureTextEntry
									autoCapitalize="none"
									autoCorrect={false}
									error={resolveError(fieldErrors.password)}
								/>

								{generalError ? (
									<Text style={styles.errorText}>{generalError}</Text>
								) : null}
								
								<View style={styles.editButtonsContainer}>
									<Button
										title={cancelButton}
										onPress={handleCancelEdit}
										variant="light"
										style={styles.halfButton}
									/>
									<View style={{ width: 12 }} />
									<Button
										title={saveButton}
										onPress={handleSaveEdit}
										loading={isSaving}
										style={styles.halfButton}
									/>
								</View>
							</View>
						) : (
							<View style={styles.infoContainer}>
								<Text style={styles.infoLabel}>{nameLabel}</Text>
								<Text style={styles.infoValue}>{user?.name || "-"}</Text>
								
								<View style={styles.divider} />
								
								<Text style={styles.infoLabel}>{emailLabel}</Text>
								<Text style={styles.infoValue}>{user?.email || "-"}</Text>

								<TouchableOpacity
									style={styles.editProfileButton}
									onPress={() => setIsEditing(true)}
								>
									<Ionicons name="create-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
									<Text style={styles.editProfileButtonText}>{editButton}</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>

					<Text style={styles.sectionTitle}>{settingsTitle}</Text>
					
					<View style={styles.card}>
						<View style={styles.settingRow}>
							<View style={styles.settingTextContainer}>
								<Ionicons name="globe-outline" size={24} color={colors.primaryDark} style={styles.settingIcon} />
								<Text style={styles.settingLabel}>{languageLabel}</Text>
							</View>
							<LanguageToggle variant="dark" />
						</View>
					</View>

					<View style={styles.spacer} />

					<View style={styles.footerInfo}>
						<Text style={styles.versionText}>{versionText}</Text>
						<Text style={styles.creditsText}>{creditsText}</Text>
					</View>

					<Button
						title={logoutText}
						onPress={handleLogout}
						style={styles.logoutButton}
					/>
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	// Ornaments
	ornamentCircle1: {
		position: "absolute",
		width: 300,
		height: 300,
		borderRadius: 150,
		backgroundColor: colors.white,
		opacity: 0.05,
		top: -100,
		left: -100,
	},
	ornamentCircle2: {
		position: "absolute",
		width: 400,
		height: 400,
		borderRadius: 200,
		backgroundColor: colors.white,
		opacity: 0.04,
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
		width: 42,
		height: 42,
		borderRadius: 14,
		backgroundColor: colors.white,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 2,
		borderWidth: 1,
		borderColor: colors.lightGray,
	},
	title: {
		fontSize: size.title,
		fontWeight: "800",
		color: colors.white,
	},
	headerSpacer: {
		width: 42, // Match backButton width to center the title
	},
	content: {
		flex: 1,
		backgroundColor: colors.tertiary,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 5,
	},
	contentTablet: {},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xxl,
	},
	scrollContentTablet: {
		paddingHorizontal: "20%",
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: 20,
		padding: spacing.xl,
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.lightGray,
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.04,
		shadowRadius: 10,
		elevation: 2,
		alignItems: "center",
		width: "100%",
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.primaryLight,
		position: "relative",
	},
	avatarImage: {
		width: "100%",
		height: "100%",
		borderRadius: 40,
	},
	editIconContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: colors.primary,
		width: 26,
		height: 26,
		borderRadius: 13,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: colors.white,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
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
		backgroundColor: colors.lightGray,
		marginVertical: spacing.md,
		width: "100%",
	},
	sectionTitle: {
		fontSize: size.medium,
		fontWeight: "800",
		color: colors.primaryDark,
		marginTop: spacing.md,
		marginBottom: spacing.md,
		marginLeft: spacing.xs,
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
		color: colors.gray,
		opacity: 0.6,
	},
	creditsText: {
		fontSize: size.extraSmall,
		color: colors.gray,
		opacity: 0.6,
		marginTop: 2,
	},
	logoutButton: {
		backgroundColor: colors.danger,
		shadowColor: colors.danger,
		marginBottom: spacing.xxl,
	},
	editButtonsContainer: {
		flexDirection: "row",
		marginTop: spacing.lg,
		width: "100%",
	},
	halfButton: {
		flex: 1,
		height: 44,
	},
	editProfileButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: spacing.lg,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: colors.primary,
		borderRadius: 12,
		width: "100%",
	},
	editProfileButtonText: {
		color: colors.primary,
		fontSize: size.small + 1,
		fontWeight: "700",
	},
	errorText: {
		color: colors.danger,
		fontSize: size.small,
		marginTop: spacing.sm,
		textAlign: "center",
		fontWeight: "600",
	},
});
