// src/lib/date.ts
// Always keep date as "YYYY-MM-DD" (no timezone surprises)
export function toYMD(x: string | Date): string {
  if (typeof x === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(x)) return x;
    const d = new Date(x);
    if (!isNaN(d.getTime())) return toYMD(d);
    return x;
  }
  const tz = x.getTimezoneOffset();
  const local = new Date(x.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}
