// src/utils/apiFetch.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../config/storageKeys";

export async function apiFetch(url, options = {}) {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const headers = {
    ...(options.headers || {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
