import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "ID" | "FR";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = "@dicoling_language";

const LanguageContext = createContext<LanguageContextType>({
  language: "ID",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isLoading: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ID");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "ID" || stored === "FR") {
          setLanguageState(stored);
        }
      } catch (error) {
        console.warn("Failed to load language from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn("Failed to save language to storage:", error);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next = current === "ID" ? "FR" : "ID";
      AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => {
        console.warn("Failed to save language to storage:", error);
      });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, isLoading }),
    [language, setLanguage, toggleLanguage, isLoading],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
