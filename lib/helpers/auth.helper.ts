import { STORAGE_KEYS } from "@/lib/constants";
import type { User } from "@/lib/types/auth.types";

export const authHelper = {
  setTokens: (accessToken: string, refreshToken?: string) => {
    // Set in localStorage for client-side access
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    // Set in cookies for middleware access
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; SameSite=Lax`;
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        30 * 24 * 60 * 60
      }; SameSite=Lax`;
    }
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    // Clear cookies
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  },

  isAuthenticated: (): boolean => {
    return !!authHelper.getAccessToken();
  },
};
