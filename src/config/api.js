// src/config/api.js
// Set EXPO_PUBLIC_API_URL in .env (e.g. for production) or leave unset to use dev default.
export const BASE_URL =
  typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://192.168.1.2:5000";
