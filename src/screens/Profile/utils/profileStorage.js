// src/screens/Profile/utils/profileStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_KEY = "APP_PROFILE";

export async function loadProfileLocal() {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveProfileLocal(profile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
