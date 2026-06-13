import * as Network from "expo-network";
import type { UserRow } from "@/services/repository";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
  getUnsyncedUsers,
  insertUser,
  markUserSynced,
  updateUserAfterOnlineLogin,
  updateUserLastActive,
  upsertUser,
} from "@/services/repository";

const API_BASE = "https://dicoling-api.vercel.app";
// ── Types ──────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  lastActiveAt: string;
  profileImageUri?: string | null;
}

export interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  fieldErrors?: FieldErrors;
  generalError?: string;
}

// ── Validation helpers ─────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(
  name: string,
  email: string,
  password: string,
): FieldErrors | null {
  const errors: FieldErrors = {};

  if (!name.trim()) errors.name = "required";
  if (!email.trim()) errors.email = "required";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = "invalidEmail";
  if (!password) errors.password = "required";
  else if (password.length < 6) errors.password = "passwordTooShort";

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateLogin(
  email: string,
  password: string,
): FieldErrors | null {
  const errors: FieldErrors = {};

  if (!email.trim()) errors.email = "required";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = "invalidEmail";
  if (!password) errors.password = "required";
  else if (password.length < 6) errors.password = "passwordTooShort";

  return Object.keys(errors).length > 0 ? errors : null;
}

// ── Network ────────────────────────────────────────────────────────────

async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return !!(state.isConnected && state.isInternetReachable);
  } catch {
    return false;
  }
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    lastActiveAt: row.last_active_at,
    profileImageUri: row.profile_image_uri,
  };
}

export async function updateProfileImage(
  email: string,
  uri: string | null,
): Promise<void> {
  const { updateUserProfileImage } = await import("@/services/repository");
  await updateUserProfileImage(email, uri);
}

// ── Register ───────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  // 1. Validate
  const fieldErrors = validateRegister(name, email, password);
  if (fieldErrors) return { success: false, fieldErrors };

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  // 2. Check if email already exists locally
  const existing = await getUserByEmail(trimmedEmail);
  if (existing) {
    return { success: false, generalError: "emailTaken" };
  }

  // 3. Try online registration first
  const online = await isOnline();

  if (online) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      if (res.status === 409) {
        return { success: false, generalError: "emailTaken" };
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const apiError =
          typeof body.error === "string"
            ? body.error
            : typeof body.message === "string"
              ? body.message
              : undefined;
        return {
          success: false,
          generalError: apiError || "unknownError",
        };
      }

      // API success → save locally as synced
      await upsertUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        synced: 1,
      });

      const user = await getUserByEmail(trimmedEmail);

      return { success: true, user: user ? rowToUser(user) : undefined };
    } catch {
      // Network failed mid-request → fall through to offline
      return { success: false, generalError: "networkError" };
    }
  }

  // 4. Offline → save locally as unsynced
  await insertUser({
    name: trimmedName,
    email: trimmedEmail,
    password,
    synced: 0,
  });

  const user = await getUserByEmail(trimmedEmail);

  return { success: true, user: user ? rowToUser(user) : undefined };
}

// ── Login ──────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  // 1. Validate
  const fieldErrors = validateLogin(email, password);
  if (fieldErrors) return { success: false, fieldErrors };

  const trimmedEmail = email.trim().toLowerCase();
  const online = await isOnline();

  if (online) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      if (res.status === 401) {
        return { success: false, generalError: "invalidCredentials" };
      }

      if (res.status === 400) {
        return { success: false, generalError: "invalidCredentials" };
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const apiError =
          typeof body.error === "string"
            ? body.error
            : typeof body.message === "string"
              ? body.message
              : undefined;
        return {
          success: false,
          generalError: apiError || "unknownError",
        };
      }

      const data = await res.json();
      const apiUser = data.user as {
        id: number;
        name: string;
        email: string;
      };

      // Upsert user locally
      const existing = await getUserByEmail(trimmedEmail);

      if (existing) {
        await updateUserAfterOnlineLogin({
          name: apiUser.name,
          email: trimmedEmail,
        });
      } else {
        await insertUser({
          name: apiUser.name,
          email: trimmedEmail,
          password,
          synced: 1,
        });
      }

      const user = await getUserByEmail(trimmedEmail);

      return { success: true, user: user ? rowToUser(user) : undefined };
    } catch {
      // Network error → fall through to offline login
    }
  }

  // Offline login: match against local DB
  const localUser = await getUserByEmailAndPassword(trimmedEmail, password);

  if (!localUser) {
    return { success: false, generalError: "invalidCredentials" };
  }

  // Update last_active_at locally
  await updateUserLastActive(localUser.id);

  return { success: true, user: rowToUser(localUser) };
}

// ── Background sync ────────────────────────────────────────────────────

/** Sync pending registrations to the API when network is available. */
export async function syncPendingRegistrations(): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  const unsyncedUsers = await getUnsyncedUsers();

  for (const user of unsyncedUsers) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      });

      if (res.ok || res.status === 409) {
        // Mark as synced (409 means already registered on server, which is fine)
        await markUserSynced(user.id);
      }
    } catch {
      // Network error during sync, will retry next time
    }
  }
}

/** Update lastActiveAt on the server for the current user. */
export async function syncLastActive(email: string): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  try {
    // Login call updates lastActiveAt on server automatically per API docs
    const user = await getUserByEmail(email);
    if (!user) return;

    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
  } catch {
    // Silently fail — this is a background sync
  }
}

/** Get a locally stored user by email (for session restore). */
export async function getLocalUser(email: string): Promise<User | null> {
  const row = await getUserByEmail(email);
  return row ? rowToUser(row) : null;
}
