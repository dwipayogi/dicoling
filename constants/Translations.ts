import { Language } from "@/contexts/LanguageContext";

const translations = {
  ID: {
    landing: {
      description:
        "Dicoling adalah aplikasi kamus linguistik bilingual (Indonesia–Prancis) yang dirancang untuk memudahkan pencarian dan pemahaman istilah kebahasaan secara cepat dan sistematis.",
      enterButton: "Masuk",
      footer: "Dibuat oleh Tim Universitas Negeri Yogyakarta",
    },
    masuk: {
      emailLabel: "Email",
      emailPlaceholder: "Email",
      passwordLabel: "Password",
      passwordPlaceholder: "Password",
      loginButton: "Masuk",
      noAccount: "Belum punya akun? ",
      registerLink: "Daftar",
    },
    daftar: {
      nameLabel: "Nama",
      namePlaceholder: "Nama Lengkap",
      emailLabel: "Email",
      emailPlaceholder: "Email",
      passwordLabel: "Password",
      passwordPlaceholder: "Password",
      registerButton: "Daftar",
      hasAccount: "Sudah punya akun? ",
      loginLink: "Masuk",
    },
    errors: {
      required: "Wajib diisi",
      invalidEmail: "Format email tidak valid",
      passwordTooShort: "Password minimal 6 karakter",
      emailTaken: "Email sudah terdaftar",
      invalidCredentials: "Email atau password salah",
      networkError: "Gagal terhubung ke server",
      unknownError: "Terjadi kesalahan, coba lagi",
    },
    home: {
      greetingMorning: "Selamat Pagi",
      greetingAfternoon: "Selamat Siang",
      greetingEvening: "Selamat Sore",
      greetingNight: "Selamat Malam",
      searchPlaceholder: "Cari istilah...",
      categories: [
        {
          id: "1",
          title: "Fonologi",
          description: "Kajian tentang bunyi bahasa",
        },
        {
          id: "2",
          title: "Sintaksis",
          description: "Kajian tentang struktur kalimat",
        },
        {
          id: "3",
          title: "Semantik",
          description: "Kajian tentang makna",
        },
        {
          id: "4",
          title: "Pragmatik",
          description: "Kajian tentang konteks",
        },
        {
          id: "5",
          title: "Morfologi",
          description: "Kajian tentang bentuk dan pembentukan kata.",
        },
        {
          id: "6",
          title: "Analisis Wacana",
          description: "Kajian bahasa dalam konteks teks dan sosial",
        },
      ],
    },
    profil: {
      titleText: "Profil",
      nameLabel: "Nama",
      emailLabel: "Email",
      settingsTitle: "Pengaturan",
      languageLabel: "Bahasa",
      logoutText: "Keluar",
      versionText: "Versi 1.1.0",
      creditsText: "Dibuat oleh Tim Universitas Negeri Yogyakarta",
      uploadTitle: "Ubah Foto Profil",
      uploadDesc: "Pilih foto profil dari galeri atau ambil foto baru",
      cameraOption: "Ambil Foto",
      galleryOption: "Pilih dari Galeri",
      deleteOption: "Hapus Foto",
      cancelOption: "Batal",
      cameraPermissionTitle: "Izin Kamera",
      cameraPermissionMessage: "Aplikasi membutuhkan izin kamera untuk mengambil foto profil.",
    },
  },
  FR: {
    landing: {
      description:
        "Dicoling est une application de dictionnaire linguistique bilingue (indonésien-français) conçue pour faciliter la recherche et la compréhension rapide et systématique des termes linguistiques.",
      enterButton: "Entrer",
      footer: "Réalisé par l'équipe Universitas Negeri Yogyakarta",
    },
    masuk: {
      emailLabel: "E-mail",
      emailPlaceholder: "E-mail",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Mot de passe",
      loginButton: "Se connecter",
      noAccount: "Pas encore de compte ? ",
      registerLink: "S'inscrire",
    },
    daftar: {
      nameLabel: "Nom",
      namePlaceholder: "Nom complet",
      emailLabel: "E-mail",
      emailPlaceholder: "E-mail",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Mot de passe",
      registerButton: "S'inscrire",
      hasAccount: "Vous avez déjà un compte ? ",
      loginLink: "Se connecter",
    },
    errors: {
      required: "Champ obligatoire",
      invalidEmail: "Format d'e-mail invalide",
      passwordTooShort: "Mot de passe min. 6 caractères",
      emailTaken: "E-mail déjà utilisé",
      invalidCredentials: "E-mail ou mot de passe incorrect",
      networkError: "Connexion au serveur échouée",
      unknownError: "Une erreur est survenue, réessayez",
    },
    home: {
      greetingMorning: "Bonjour",
      greetingAfternoon: "Bonjour",
      greetingEvening: "Bonsoir",
      greetingNight: "Bonsoir",
      searchPlaceholder: "Rechercher un terme...",
      categories: [
        {
          id: "1",
          title: "Phonologie",
          description: "Étude de la phonétique",
        },
        {
          id: "2",
          title: "Syntaxe",
          description: "Étude de la structure de la phrase",
        },
        {
          id: "3",
          title: "Sémantique",
          description: "Étude sur le sens",
        },
        {
          id: "4",
          title: "Pragmatique",
          description: "Analyse du sens dans son contexte",
        },
        {
          id: "5",
          title: "Morphologie",
          description: "Étude de la forme et de la formation des mots",
        },
        {
          id: "6",
          title: "Analyse du discours",
          description: "étude de la langue dans son contexte textuel et social",
        },
      ],
    },
    profil: {
      titleText: "Profil",
      nameLabel: "Nom",
      emailLabel: "E-mail",
      settingsTitle: "Paramètres",
      languageLabel: "Langue",
      logoutText: "Se déconnecter",
      versionText: "Version 1.1.0",
      creditsText: "Réalisé par l'équipe Universitas Negeri Yogyakarta",
      uploadTitle: "Modifier la photo de profil",
      uploadDesc: "Choisissez une photo de profil dans la galerie ou prenez-en une nouvelle",
      cameraOption: "Prendre une photo",
      galleryOption: "Choisir de la galerie",
      deleteOption: "Supprimer la photo",
      cancelOption: "Annuler",
      cameraPermissionTitle: "Permission de la caméra",
      cameraPermissionMessage: "L'application nécessite la permission de la caméra pour prendre une photo de profil.",
    },
  },
} as const;

export function t(language: Language) {
  return translations[language];
}

export default translations;
