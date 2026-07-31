"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";

const USER_KEY = "unisport-auth-user";
const USERS_KEY = "unisport-auth-users";

function readCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function readAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAllUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

let authListeners: Array<() => void> = [];
let cachedUser: User | null = null;
let hasHydrated = false;

function emitAuthChange() {
  cachedUser = readCurrentUser();
  authListeners.forEach((l) => l());
}

function getAuthSnapshot(): User | null {
  if (typeof window === "undefined") return cachedUser;
  if (!hasHydrated) {
    hasHydrated = true;
    cachedUser = readCurrentUser();
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return cachedUser;
}

function subscribeAuth(callback: () => void) {
  authListeners = [...authListeners, callback];
  return () => {
    authListeners = authListeners.filter((l) => l !== callback);
  };
}

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  campus: string;
  faculty: string;
  department: string;
  level: string;
}

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "firstName" | "lastName" | "campus" | "faculty" | "department" | "level" | "avatar">>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function generateId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerSnapshot);
  const [, forceRender] = useState(0);

  const login = useCallback(async (email: string) => {
    const users = readAllUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: "No account found with this email." };
    }
    writeCurrentUser(found);
    emitAuthChange();
    forceRender((n) => n + 1);
    return { success: true };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const users = readAllUsers();
    const exists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: User = {
      id: generateId(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(input.firstName + " " + input.lastName)}&backgroundColor=0ea5e9`,
      campus: input.campus,
      faculty: input.faculty,
      department: input.department,
      level: input.level,
      joinedAt: new Date().toISOString(),
      verifiedStudent: true,
    };

    writeAllUsers([...users, newUser]);
    writeCurrentUser(newUser);
    emitAuthChange();
    forceRender((n) => n + 1);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    writeCurrentUser(null);
    emitAuthChange();
    forceRender((n) => n + 1);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<Pick<User, "firstName" | "lastName" | "campus" | "faculty" | "department" | "level" | "avatar">>) => {
      const current = readCurrentUser();
      if (!current) return;
      const updated = { ...current, ...updates };
      writeCurrentUser(updated);

      const users = readAllUsers();
      const idx = users.findIndex((u) => u.id === current.id);
      if (idx !== -1) {
        users[idx] = updated;
        writeAllUsers(users);
      }

      emitAuthChange();
      forceRender((n) => n + 1);
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser: user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
