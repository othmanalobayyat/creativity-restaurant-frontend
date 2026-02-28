// src/screens/Favorites/hooks/useFavorites.js
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getFavoriteIds } from "../../../utils/favoritesStorage";
import { apiFetch } from "../../../api/apiFetch";

async function fetchItemById(id) {
  return apiFetch(`/api/items/${encodeURIComponent(id)}`);
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [itemsById, setItemsById] = useState({}); // { [id]: item }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ids = await getFavoriteIds();
      setFavoriteIds(ids);

      if (!ids.length) {
        setItemsById({});
        return;
      }

      // ✅ جيب كل العناصر
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const item = await fetchItemById(id);
            return { id: String(id), item };
          } catch {
            // لو عنصر انحذف من السيرفر أو فشل
            return { id: String(id), item: null };
          }
        }),
      );

      const nextMap = {};
      for (const r of results) {
        if (r.item) nextMap[r.id] = r.item;
      }
      setItemsById(nextMap);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const favorites = useMemo(() => {
    // ترتيب العناصر حسب ترتيب الـ ids (عشان يضل ثابت)
    return favoriteIds.map((id) => itemsById[String(id)]).filter(Boolean);
  }, [favoriteIds, itemsById]);

  const onFavChanged = useCallback((id, isNowFav) => {
    if (isNowFav) return;

    const sid = String(id);

    // ✅ شيلها فورًا من الشاشة
    setFavoriteIds((prev) => prev.filter((x) => String(x) !== sid));
    setItemsById((prev) => {
      const copy = { ...prev };
      delete copy[sid];
      return copy;
    });
  }, []);

  return { favorites, loading, error, onFavChanged, reload: load };
}
