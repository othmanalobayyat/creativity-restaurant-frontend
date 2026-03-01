// src/api/apiFetch.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../config/storageKeys";
import { BASE_URL } from "../config/api";

export async function apiFetch(pathOrUrl, options = {}) {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const url = /^https?:\/\//.test(pathOrUrl)
    ? pathOrUrl
    : `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg =
      json?.error ||
      json?.message ||
      (text && text.slice(0, 120)) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return json;
}
