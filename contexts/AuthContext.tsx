import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getLocalUser,
  syncLastActive,
  syncPendingRegistrations,
  type User,
  type AuthResult,
  login as authLogin,
  register as authRegister,
} from "@/services/auth";

// ── Types ──────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  logout: () => void;
}

const STORAGE_KEY = "@dicoling_user_email";

// ── Context ────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

// ── Provider ───────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const email = await AsyncStorage.getItem(STORAGE_KEY);
        if (email) {
          const stored = await getLocalUser(email);
          if (stored) setUser(stored);
        }
      } catch (error) {
        console.warn("Failed to restore auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Background sync: sync pending registrations and lastActive when app loads
  useEffect(() => {
    syncPendingRegistrations().catch(() => {});

    if (user?.email) {
      syncLastActive(user.email).catch(() => {});
    }
  }, [user?.email]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const result = await authLogin(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        await AsyncStorage.setItem(STORAGE_KEY, result.user.email);
      }
      return result;
    },
    [],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      const result = await authRegister(name, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        await AsyncStorage.setItem(STORAGE_KEY, result.user.email);
      }
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
