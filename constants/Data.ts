import translations from "@/constants/Translations";
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
  {
    category: "Fonologi",
    lang: "ID",
    data: [
      {
        name: "Fonologi",
        name_norm: "fonologi",
        desc: "Fonologi adalah cabang linguistik yang mempelajari sistem bunyi dalam suatu bahasa, termasuk bagaimana bunyi diorganisasi dan digunakan untuk membedakan makna (Odden, 2005).",
        example:
          "Dalam bahasa Indonesia, fonem /p/ dan /b/ membedakan kata “padi” dan “badi”, yang memiliki makna berbeda. Analisis fonologi membantu memahami bagaimana perbedaan bunyi ini berfungsi dalam sistem bahasa.",
      },
      {
        name: "Fonem",
        name_norm: "fonem",
        desc: "Fonem adalah unit bunyi terkecil dalam suatu bahasa yang dapat membedakan makna. Fonem tidak memiliki makna sendiri, tetapi perbedaan fonem dapat mengubah makna kata (Trask, 1996).",
        example:
          "Dalam bahasa Indonesia, fonem /k/ dan /g/ membedakan kata “kaki” dan “gaki”, yang memiliki makna berbeda. Analisis fonem membantu memahami bagaimana perbedaan bunyi ini berfungsi dalam sistem bahasa.",
      },
      {
        name: "Alofon",
        name_norm: "alofon",
        desc: "Alofon adalah variasi fonem yang tidak mengubah makna kata. Alofon dapat dipengaruhi oleh lingkungan fonetik atau faktor sosial (Ladefoged, 2001).",
        example:
          "Dalam bahasa Indonesia, fonem /t/ memiliki alofon [t] dan [ʔ] (glottal stop) dalam posisi akhir kata, seperti dalam kata “kota” yang dapat diucapkan sebagai [kota] atau [kotaʔ]. Analisis alofon membantu memahami variasi bunyi yang terjadi dalam bahasa.",
      },
      {
        name: "Suku Kata",
        name_norm: "suku kata",
        desc: "Suku kata adalah unit fonologis yang terdiri dari satu atau lebih fonem yang diucapkan sebagai satu kesatuan. Suku kata biasanya terdiri dari inti vokal dan dapat memiliki konsonan sebelum atau sesudahnya (Crystal, 2008).",
        example:
          "Dalam bahasa Indonesia, kata “buku” terdiri dari dua suku kata: “bu” dan “ku”. Analisis suku kata membantu memahami struktur fonologis kata dalam bahasa.",
      },
      {
        name: "Intonasi",
        name_norm: "intonasi",
        desc: "Intonasi adalah pola naik turun nada dalam ucapan yang dapat memberikan informasi tambahan tentang makna, emosi, atau fungsi komunikatif (Ladd, 2008).",
        example:
          "Dalam bahasa Indonesia, kalimat “Kamu pergi?” dengan intonasi naik di akhir menunjukkan pertanyaan, sedangkan dengan intonasi datar menunjukkan pernyataan. Analisis intonasi membantu memahami bagaimana variasi nada dapat mempengaruhi makna dalam komunikasi.",
      },
      {
        name: "Stres",
        name_norm: "stres",
        desc: "Stres adalah penekanan yang diberikan pada suku kata tertentu dalam sebuah kata atau kalimat, yang dapat mempengaruhi makna atau fungsi komunikatif (Crystal, 2008).",
        example:
          "Dalam bahasa Indonesia, kata “bisa” dengan stres pada suku kata pertama berarti “dapat”, sedangkan dengan stres pada suku kata kedua berarti “racun”. Analisis stres membantu memahami bagaimana penekanan dapat mempengaruhi makna dalam bahasa.",
      },
    ],
  },
  {
    category: "Fonologi",
    lang: "FR",
    data: [
      {
        name: "Phonologie",
        name_norm: "phonologie",
        desc: "La phonologie est une branche de la linguistique qui étudie le système de sons d'une langue, y compris comment les sons sont organisés et utilisés pour différencier les significations (Odden, 2005).",
        example:
          "En français, les phonèmes /p/ et /b/ différencient les mots “papa” et “baba”, qui ont des significations différentes. L'analyse phonologique aide à comprendre comment ces différences de sons fonctionnent dans le système de la langue.",
      },
      {
        name: "Phonème",
        name_norm: "phonème",
        desc: "Un phonème est la plus petite unité sonore d'une langue qui peut différencier les significations. Les phonèmes n'ont pas de signification propre, mais la différence entre les phonèmes peut changer la signification d'un mot (Trask, 1996).",
        example:
          "En français, les phonèmes /k/ et /g/ différencient les mots “carte” et “garte”, qui ont des significations différentes. L'analyse phonémique aide à comprendre comment ces différences de sons fonctionnent dans le système de la langue.",
      },
      {
        name: "Allophone",
        name_norm: "allophone",
        desc: "Un allophone est une variation d'un phonème qui ne change pas la signification d'un mot. Les allophones peuvent être influencés par l'environnement phonétique ou des facteurs sociaux (Ladefoged, 2001).",
        example:
          "En français, le phonème /t/ a des allophones [t] et [ʔ] (coup de glotte) en position finale de mot, comme dans le mot “chat” qui peut être prononcé [ʃa] ou [ʃaʔ]. L'analyse des allophones aide à comprendre les variations de sons qui se produisent dans la langue.",
      },
      {
        name: "Syllabe",
        name_norm: "syllabe",
        desc: "Une syllabe est une unité phonologique composée d'un ou plusieurs phonèmes prononcés comme une seule entité. Une syllabe comprend généralement un noyau vocalique et peut avoir des consonnes avant ou après (Crystal, 2008).",
        example:
          "En français, le mot “bouteille” se compose de deux syllabes : “bou” et “teille”. L'analyse des syllabes aide à comprendre la structure phonologique des mots dans la langue.",
      },
      {
        name: "Intonation",
        name_norm: "intonation",
        desc: "L'intonation est le schéma de montée et de descente de la voix dans la parole qui peut fournir des informations supplémentaires sur le sens, les émotions ou la fonction communicative (Ladd, 2008).",
        example:
          "En français, la phrase “Tu vas?” avec une intonation montante à la fin indique une question, tandis qu'une intonation plate indique une déclaration. L'analyse de l'intonation aide à comprendre comment les variations de ton peuvent affecter le sens dans la communication.",
      },
      {
        name: "Accentuation",
        name_norm: "accentuation",
        desc: "L'accentuation est l'emphase donnée à une syllabe particulière dans un mot ou une phrase, qui peut affecter le sens ou la fonction communicative (Crystal, 2008).",
        example:
          "En français, le mot “pêche” avec l'accent sur la première syllabe signifie “fruit”, tandis qu'avec l'accent sur la deuxième syllabe signifie “action de pêcher”. L'analyse de l'accentuation aide à comprendre comment l'emphase peut affecter le sens dans la langue.",
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

const FALLBACK_CATEGORY_KEY = "Fonologi";
const FALLBACK_CATEGORY_ID =
  translations.ID.home.categories.find(
    (category) => category.title === FALLBACK_CATEGORY_KEY,
  )?.id ?? "1";

function slugifyCategoryTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategoryKeyById(categoryId: string) {
  return (
    translations.ID.home.categories.find(
      (category) => category.id === categoryId,
    )?.title ?? FALLBACK_CATEGORY_KEY
  );
}

function getCategoryTitleById(categoryId: string, language: Language) {
  return (
    translations[language].home.categories.find(
      (category) => category.id === categoryId,
    )?.title ?? getCategoryKeyById(categoryId)
  );
}

function findCategoryIdBySlug(categorySlug: string) {
  const normalizedSlug = slugifyCategoryTitle(categorySlug);
  const languages = Object.keys(translations) as Language[];

  for (const language of languages) {
    const matched = translations[language].home.categories.find(
      (category) => slugifyCategoryTitle(category.title) === normalizedSlug,
    );

    if (matched) {
      return matched.id;
    }
  }

  return undefined;
}

export function getCategorySlug(title: string) {
  return slugifyCategoryTitle(title);
}

export type ResolvedCategory = {
  id: string;
  key: string;
  title: string;
  items: DictionaryItem[];
  isFallback: boolean;
};

export function resolveCategoryFromSlug(
  categorySlug: string | undefined,
  language: Language,
): ResolvedCategory {
  const requestedId = categorySlug
    ? findCategoryIdBySlug(categorySlug)
    : undefined;
  const resolvedId = requestedId ?? FALLBACK_CATEGORY_ID;
  const resolvedKey = getCategoryKeyById(resolvedId);
  const resolvedTitle = getCategoryTitleById(resolvedId, language);
  const resolvedItems = getCategoryItems(resolvedKey, language);

  if (resolvedItems.length === 0 && resolvedId !== FALLBACK_CATEGORY_ID) {
    const fallbackTitle = getCategoryTitleById(FALLBACK_CATEGORY_ID, language);
    return {
      id: FALLBACK_CATEGORY_ID,
      key: FALLBACK_CATEGORY_KEY,
      title: fallbackTitle,
      items: getCategoryItems(FALLBACK_CATEGORY_KEY, language),
      isFallback: true,
    };
  }

  return {
    id: resolvedId,
    key: resolvedKey,
    title: resolvedTitle,
    items: resolvedItems,
    isFallback: resolvedId !== requestedId,
  };
}
