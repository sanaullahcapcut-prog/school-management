// Keep dates as plain strings "YYYY-MM-DD" to avoid timezone shifts.
export function toYMD(x: string | Date): string {
  if (typeof x === "string") {
    // already looks like 2025-09-19 ?
    if (/^\d{4}-\d{2}-\d{2}$/.test(x)) return x;
    const d = new Date(x);
    if (!isNaN(d.getTime())) return toYMD(d);
    return x;
  }
  const d = x;
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}
