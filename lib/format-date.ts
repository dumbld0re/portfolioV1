import type { Language } from "@/lib/i18n"

/** "2026-07-08" -> "8 July 2026" / "8. Juli 2026". Parsed as UTC so the day never shifts. */
export function formatPostDate(date: string, language: Language) {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed)
}
