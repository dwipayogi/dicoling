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
  updateProfileImage as authUpdateProfileImage,
  updateProfile as authUpdateProfile,
} from "@/services/auth";

// ── Types ──────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfileImage: (uri: string | null) => Promise<void>;
  updateProfile: (
    name: string,
    email: string,
    password?: string,
  ) => Promise<AuthResult>;
}

const STORAGE_KEY = "@dicoling_user_email";

// ── Context ────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateProfileImage: async () => {},
  updateProfile: async () => ({ success: false }),
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
          if (stored) {
            setUser(stored);
            return;
          }
        }

        // If not found in AsyncStorage, check SQLite database for saved session
        const { getSavedUser } = await import("@/services/auth");
        const saved = await getSavedUser();
        if (saved) {
          setUser(saved);
          await AsyncStorage.setItem(STORAGE_KEY, saved.email);
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
    async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
      const result = await authLogin(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        await AsyncStorage.setItem(STORAGE_KEY, result.user.email);

        const { updateUserSaveState } = await import("@/services/auth");
        await updateUserSaveState(result.user.email, rememberMe ? "save" : null);
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
    if (user?.email) {
      const { updateUserSaveState } = await import("@/services/auth");
      await updateUserSaveState(user.email, null);
    }
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, [user?.email]);

  const updateProfileImage = useCallback(
    async (uri: string | null) => {
      if (user?.email) {
        await authUpdateProfileImage(user.email, uri);
        setUser((prev) => (prev ? { ...prev, profileImageUri: uri } : null));
      }
    },
    [user?.email],
  );

  const updateProfile = useCallback(
    async (
      name: string,
      email: string,
      password?: string,
    ): Promise<AuthResult> => {
      if (user?.email) {
        const result = await authUpdateProfile(
          user.email,
          name,
          email,
          password,
        );
        if (result.success && result.user) {
          setUser(result.user);
          await AsyncStorage.setItem(STORAGE_KEY, result.user.email);
        }
        return result;
      }
      return { success: false, generalError: "unknownError" };
    },
    [user?.email],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfileImage,
      updateProfile,
    }),
    [user, isLoading, login, register, logout, updateProfileImage, updateProfile],
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
