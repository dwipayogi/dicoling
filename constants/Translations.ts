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
      emailLabel: "Email",
      emailPlaceholder: "Email",
      passwordLabel: "Password",
      passwordPlaceholder: "Password",
      confirmPasswordLabel: "Konfirmasi Password",
      confirmPasswordPlaceholder: "Konfirmasi Password",
      registerButton: "Daftar",
      hasAccount: "Sudah punya akun? ",
      loginLink: "Masuk",
    },
    home: {
      greeting: "Selamat Siang, Budi",
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
      emailLabel: "E-mail",
      emailPlaceholder: "E-mail",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Confirmer le mot de passe",
      registerButton: "S'inscrire",
      hasAccount: "Vous avez déjà un compte ? ",
      loginLink: "Se connecter",
    },
    home: {
      greeting: "Bonjour, Budi",
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
  },
} as const;

export function t(language: Language) {
  return translations[language];
}

export default translations;
