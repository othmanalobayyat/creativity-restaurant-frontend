import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "APP_FAVORITES";

export async function getFavoriteIds() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function isFavorite(id) {
  const list = await getFavoriteIds();
  return list.includes(String(id));
}

export async function toggleFavorite(id) {
  const list = await getFavoriteIds();
  const sid = String(id);

  const next = list.includes(sid)
    ? list.filter((x) => x !== sid)
    : [sid, ...list];

  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
