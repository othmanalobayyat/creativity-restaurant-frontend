export const TZ_MODE = {
  USER: "USER",
  FIXED: "FIXED", // Asia/Jerusalem
};

export const DATE_FORMAT = {
  ISO: "ISO",
  LOCAL: "LOCAL",
};

export const formatDateSmart = (
  raw,
  { tzMode = TZ_MODE.USER, format = DATE_FORMAT.LOCAL } = {},
) => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);

  const baseOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // ✅ 1) USER timezone
  if (tzMode === TZ_MODE.USER) {
    if (format === DATE_FORMAT.LOCAL) {
      return d.toLocaleString("en-GB", baseOptions);
    }

    // ISO لكن بوقت الجهاز (نفس ستايلك القديم)
    const offset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - offset);
    return local.toISOString().replace("Z", "");
  }

  // ✅ 2) FIXED timezone (Asia/Jerusalem)
  if (format === DATE_FORMAT.LOCAL) {
    return d.toLocaleString("en-GB", {
      ...baseOptions,
      timeZone: "Asia/Jerusalem",
    });
  }

  // ISO لكن حسب Asia/Jerusalem
  const parts = new Intl.DateTimeFormat("en-GB", {
    ...baseOptions,
    timeZone: "Asia/Jerusalem",
  }).formatToParts(d);

  const get = (t) => parts.find((p) => p.type === t)?.value;

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get(
    "minute",
  )}:${get("second")}.000`;
};
