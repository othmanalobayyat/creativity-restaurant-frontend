// src/api/apiFetch.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../config/storageKeys";
import { BASE_URL } from "../config/api";

export async function apiFetch(path, options = {}) {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
