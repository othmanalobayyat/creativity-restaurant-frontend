import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "APP_FAVORITES";

/**
 * Always returns an array of string IDs
 */
async function readList() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // تأكد إنهم strings + بدون null
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

async function writeList(list) {
  try {
    // remove duplicates just in case
    const unique = [...new Set(list.map(String))];
    await AsyncStorage.setItem(KEY, JSON.stringify(unique));
  } catch {
    // ممكن تضيف log لو بدك
  }
}

export async function getFavoriteIds() {
  return readList();
}

export async function isFavorite(id) {
  const list = await readList();
  return list.includes(String(id));
}

export async function toggleFavorite(id) {
  const list = await readList();
  const sid = String(id);

  const next = list.includes(sid)
    ? list.filter((x) => x !== sid)
    : [sid, ...list];

  await writeList(next);
  return next;
}

/**
 * Optional helper: remove directly
 */
export async function removeFavorite(id) {
  const list = await readList();
  const sid = String(id);
  const next = list.filter((x) => x !== sid);
  await writeList(next);
  return next;
}
