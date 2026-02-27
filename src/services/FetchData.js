import { useEffect, useRef, useState } from "react";

const isAbortError = (e) =>
  e?.name === "AbortError" ||
  String(e?.message || "")
    .toLowerCase()
    .includes("abort");

const DataFetch = (url, options = {}) => {
  const { keepPreviousData = true } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // أول تحميل فقط
  const [refreshing, setRefreshing] = useState(false); // تحميل فوق بيانات موجودة
  const [error, setError] = useState(null);

  const lastUrlRef = useRef(null);
  const lastJsonRef = useRef(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const hasData = Array.isArray(data) ? data.length > 0 : !!data;
    const isFirstLoad = lastUrlRef.current === null;

    // ✅ لا تعمل flicker: لو عندك بيانات، خليها refreshing بدل loading
    if (isFirstLoad || !keepPreviousData || !hasData) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    (async () => {
      try {
        lastUrlRef.current = url;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(json?.error || `Request failed: ${res.status}`);
        }

        // ✅ قلل re-render: إذا نفس النتيجة رجعت لا تعمل setData
        const sameAsBefore =
          JSON.stringify(json) === JSON.stringify(lastJsonRef.current);

        if (alive && !sameAsBefore) {
          lastJsonRef.current = json;
          setData(json);
        }
      } catch (e) {
        // ✅ تجاهل Abort لأنه طبيعي أثناء البحث
        if (!alive || isAbortError(e)) return;
        if (alive) setError(e);
      } finally {
        if (!alive) return;
        setLoading(false);
        setRefreshing(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, refreshing, error };
};

export default DataFetch;
