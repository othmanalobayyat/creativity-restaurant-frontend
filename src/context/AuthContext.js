// src/context/AuthContext.js
import { apiFetch } from "../api/apiFetch";
import { saveProfileLocal } from "../screens/Profile/utils/profileStorage";
import { clearProfileLocal } from "../screens/Profile/utils/profileStorage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY, USER_KEY } from "../config/storageKeys";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem(TOKEN_KEY);
        const uRaw = await AsyncStorage.getItem(USER_KEY);
        setToken(t || null);
        setUser(uRaw ? JSON.parse(uRaw) : null);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const isLoggedIn = !!token;

  const login = useCallback(async ({ token: t, user: u }) => {
    await AsyncStorage.setItem(TOKEN_KEY, t);
    if (u) await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));

    setToken(t);
    setUser(u || null);

    try {
      const me = await apiFetch("/api/me");

      await saveProfileLocal({
        fullName: me.fullName || me.name || "",
        phone: me.phone || "",
        email: me.email || "",
      });
    } catch (e) {
      console.log("Profile fetch failed after login", e);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    await clearProfileLocal(); // ✅ يمسح الاسم القديم
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isReady, isLoggedIn, token, user, login, logout }),
    [isReady, isLoggedIn, token, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
