// src/services/FetchData.js
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/apiFetch";

const isAbortError = (e) =>
  e?.name === "AbortError" ||
  String(e?.message || "")
    .toLowerCase()
    .includes("abort");

const stableStringify = (v) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

/**
 * DataFetch(pathOrUrl, options?)
 * - pathOrUrl: "/api/items?..." OR full URL
 * - options:
 *    - keepPreviousData (default true)
 *    - deps: extra dependencies array to force refetch (optional)
 */
export default function DataFetch(pathOrUrl, options = {}) {
  const { keepPreviousData = true, deps = [] } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const lastResultKeyRef = useRef(null);

  useEffect(() => {
    let alive = true;

    const hasData = Array.isArray(data) ? data.length > 0 : !!data;

    if (!keepPreviousData || !hasData) setLoading(true);
    else setRefreshing(true);

    setError(null);

    (async () => {
      try {
        // apiFetch رح يضيف BASE_URL لو أعطيته path
        const json = await apiFetch(
          pathOrUrl.startsWith("http")
            ? pathOrUrl.replace(/^https?:\/\/[^/]+/, "")
            : pathOrUrl,
        );

        const nextKey = stableStringify(json);
        const sameAsBefore = nextKey === lastResultKeyRef.current;

        if (alive && !sameAsBefore) {
          lastResultKeyRef.current = nextKey;
          setData(json);
        }
      } catch (e) {
        if (!alive || isAbortError(e)) return;
        setError(e);
      } finally {
        if (!alive) return;
        setLoading(false);
        setRefreshing(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathOrUrl, ...deps]);

  return { data, loading, refreshing, error };
}
