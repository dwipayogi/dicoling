import type { Language } from "@/contexts/LanguageContext";

export type DictionaryItem = {
  name: string;
  name_norm: string;
  desc: string;
  example: string;
};

export type DictionaryCategory = {
  category: string;
  lang: Language;
  data: DictionaryItem[];
};

export const Data: DictionaryCategory[] = [
  {
    category: "Analisis Wacana",
    lang: "ID",
    data: [
      {
        name: "Agen Sosial",
        name_norm: "agen sosial",
        desc: "Agen sosial adalah individu atau kelompok yang direpresentasikan sebagai pelaku dalam wacana. Representasi ini dapat eksplisit atau dihapus untuk mencerminkan relasi kekuasaan (van Leeuwen, 2008).",
        example:
          "Kompas, 13/04/2023: “Polisi menembakkan gas air mata untuk membubarkan massa yang memadati kawasan tersebut.” → Analisis: Agen polisi dinyatakan eksplisit sehingga tanggung jawab tindakan dilekatkan jelas pada institusi negara.",
      },
      {
        name: "Ambiguitas",
        name_norm: "ambiguitas",
        desc: "Ambiguitas adalah kondisi ketika ujaran memiliki lebih dari satu makna. Ketaksaan ini dapat berasal dari struktur atau leksikon (Leech, 1981).",
        example:
          "Kompas, 13/04/2023: “Aksi demonstrasi menolak UU Cipta Kerja berakhir ricuh di sejumlah titik ibu kota.” → Analisis: Tidak disebut siapa pelaku kericuhan; struktur kalimat menciptakan ambiguitas dan mengaburkan tanggung jawab.",
      },
      {
        name: "Analisis Wacana",
        name_norm: "analisis wacana",
        desc: "Analisis wacana adalah pendekatan interdisipliner untuk mempelajari bahasa dalam konteks sosialnya. Fokusnya pada bagaimana bahasa digunakan untuk membentuk realitas sosial, termasuk isu kekuasaan, ideologi, dan identitas (Fairclough, 1995).",
        example:
          "Kompas, 13/04/2023: “Pemerintah menyatakan bahwa kebijakan ini akan membawa manfaat besar bagi masyarakat.” → Analisis: Wacana pemerintah membingkai kebijakan sebagai positif, yang dapat mempengaruhi persepsi publik dan legitimasi kebijakan tersebut.",
      },
      {
        name: "Deiksis",
        name_norm: "deiksis",
        desc: "Deiksis adalah penggunaan kata atau frasa yang merujuk pada waktu, tempat, atau orang tertentu dalam konteks komunikasi. Deiksis membantu menghubungkan ujaran dengan situasi komunikasi (Levinson, 1983).",
        example:
          "Kompas, 13/04/2023: “Massa yang berkumpul di depan gedung DPR menuntut perubahan.” → Analisis: Kata “depan” adalah deiksis tempat yang menunjukkan lokasi aksi, memberikan konteks spasial yang penting untuk memahami situasi.",
      },
      {
        name: "Eufemisme",
        name_norm: "eufemisme",
        desc: "Eufemisme adalah penggunaan kata atau frasa yang lebih halus atau kurang langsung untuk menggantikan istilah yang dianggap kasar, sensitif, atau tidak menyenangkan (Allan & Burridge, 1991).",
        example:
          "Kompas, 13/04/2023: “Pemerintah melakukan penyesuaian harga BBM.” → Analisis: Istilah “penyesuaian” digunakan sebagai eufemisme untuk menaikkan harga, yang dapat mengurangi resistensi publik terhadap kebijakan tersebut.",
      },
      {
        name: "Framing",
        name_norm: "framing",
        desc: "Framing adalah proses di mana media atau komunikator memilih aspek tertentu dari realitas dan menonjolkannya dalam sebuah narasi untuk mempengaruhi persepsi audiens (Entman, 1993).",
        example:
          "Kompas, 13/04/2023: “Pemerintah menyatakan bahwa kebijakan ini akan membawa manfaat besar bagi masyarakat.” → Analisis: Framing pemerintah menyoroti manfaat kebijakan, yang dapat membentuk opini publik secara positif terhadap kebijakan tersebut.",
      },
    ],
  },
  {
    category: "Analisis Wacana",
    lang: "FR",
    data: [
      {
        name: "Analyse du discours",
        name_norm: "analyse du discours",
        desc: "L'analyse du discours est une approche interdisciplinaire pour étudier le langage dans son contexte social. Elle se concentre sur la façon dont le langage est utilisé pour construire la réalité sociale, y compris les questions de pouvoir, d'idéologie et d'identité (Fairclough, 1995).",
        example:
          "Le Monde, 13/04/2023 : “Le gouvernement affirme que cette politique apportera de grands avantages à la société.” → Analyse : Le discours du gouvernement encadre la politique comme positive, ce qui peut influencer la perception publique et la légitimité de la politique.",
      },
      {
        name: "Framing",
        name_norm: "framing",
        desc: "Le framing est le processus par lequel les médias ou les communicateurs sélectionnent certains aspects de la réalité et les mettent en avant dans une narration pour influencer la perception du public (Entman, 1993).",
        example:
          "Le Monde, 13/04/2023 : “Le gouvernement affirme que cette politique apportera de grands avantages à la société.” → Analyse : Le framing du gouvernement met en avant les avantages de la politique, ce qui peut façonner l'opinion publique de manière positive envers cette politique.",
      },
      {
        name: "Euphémisme",
        name_norm: "euphémisme",
        desc: "L'euphémisme est l'utilisation de mots ou de phrases plus doux ou moins directs pour remplacer des termes considérés comme grossiers, sensibles ou désagréables (Allan & Burridge, 1991).",
        example:
          "Le Monde, 13/04/2023 : “Le gouvernement procède à un ajustement des prix du carburant.” → Analyse : Le terme “ajustement” est utilisé comme euphémisme pour une augmentation de prix, ce qui peut réduire la résistance du public à cette politique.",
      },
      {
        name: "Ambiguïté",
        name_norm: "ambiguïté",
        desc: "L'ambiguïté est une condition où une expression a plus d'une signification. Cette indétermination peut provenir de la structure ou du lexique (Leech, 1981).",
        example:
          "Le Monde, 13/04/2023 : “Des manifestations contre la loi sur la création ont dégénéré dans plusieurs points de la capitale.” → Analyse : Il n'est pas précisé qui est responsable des débordements ; la structure de la phrase crée une ambiguïté qui obscurcit la responsabilité.",
      },
      {
        name: "Deixis",
        name_norm: "deixis",
        desc: "La deixis est l'utilisation de mots ou de phrases qui font référence à un temps, un lieu ou une personne spécifique dans le contexte de la communication. La deixis aide à relier l'énoncé à la situation de communication (Levinson, 1983).",
        example:
          "Le Monde, 13/04/2023 : “La foule rassemblée devant le bâtiment du Parlement exige des changements.” → Analyse : Le mot “devant” est une deixis spatiale qui indique l'emplacement de l'action, fournissant un contexte spatial important pour comprendre la situation.",
      },
      {
        name: "Agent social",
        name_norm: "agent social",
        desc: "Un agent social est un individu ou un groupe représenté comme acteur dans un discours. Cette représentation peut être explicite ou omise pour refléter les relations de pouvoir (van Leeuwen, 2008).",
        example:
          "Le Monde, 13/04/2023 : “La police a tiré des gaz lacrymogènes pour disperser la foule qui s'était rassemblée dans la zone.” → Analyse : L'agent de la police est explicitement mentionné, ce qui attribue clairement la responsabilité de l'action à l'institution étatique.",
      },
      {
        name: "Ambigüité",
        name_norm: "ambigüité",
        desc: "L'ambigüité est une condition où une expression a plus d'une signification. Cette indétermination peut provenir de la structure ou du lexique (Leech, 1981).",
        example:
          "Le Monde, 13/04/2023 : “Des manifestations contre la loi sur la création ont dégénéré dans plusieurs points de la capitale.” → Analyse : Il n'est pas précisé qui est responsable des débordements ; la structure de la phrase crée une ambiguïté qui obscurcit la responsabilité.",
      },
    ],
  },
];

export function getCategoryItems(categoryKey: string, language: Language) {
  return (
    Data.find(
      (category) =>
        category.category === categoryKey && category.lang === language,
    )?.data ?? []
  );
}
