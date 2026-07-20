export function formatDateDot(date: string): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function formatYearMonth(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** 7일 이내면 "n분 전/n시간 전/n일 전", 그보다 오래되면 날짜로 */
export function formatRelativeOrDate(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return locale === "ko" ? "방금 전" : locale === "ja" ? "たった今" : "just now";
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, "day");

  return formatDateDot(iso.slice(0, 10));
}
