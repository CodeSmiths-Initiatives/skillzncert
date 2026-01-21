"use client";

export const storage = {
  getSession<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const value = sessionStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  getLocal<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  setSession<T>(key: string, value: T) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },

  setLocal<T>(key: string, value: T) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  removeSession(key: string) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  },

  removeLocal(key: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
