// Keep/expect YYYY-MM-DD everywhere we store.
export function toYMD(x: string | Date): string {
  if (typeof x === "string") {
    // already 2025-09-19 ?
    if (/^\d{4}-\d{2}-\d{2}$/.test(x)) return x;
    // Try to parse other strings safely
    const d = new Date(x);
    if (!isNaN(d.getTime())) return toYMD(d);
    return x; // last resort
  }
  // Convert a Date -> local YYYY-MM-DD (no timezone shift)
  const d = x;
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}

// For showing in lists if you like DD/MM/YYYY visually
export function prettyDMY(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}
