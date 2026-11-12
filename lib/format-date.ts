import { LOCALE, type Language } from "@/lib/i18n"

/** "2026-07-08" -> "8 July 2026" / "8. Juli 2026" / "8 luglio 2026". Parsed as UTC so the day never shifts. */
export function formatPostDate(date: string, language: Language) {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(LOCALE[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed)
}

/** "2026-11-09" -> "09/11/26": day, month, two-digit year. */
export function formatShortDate(date: string) {
  const [year, month, day] = date.split("-")
  if (!year || !month || !day) return date
  return `${day}/${month}/${year.slice(-2)}`
}

const locale = (language: Language) => LOCALE[language]

/** "2026-10" -> "Oct 2026" / "Okt. 2026"; a bare year stays as it is. */
export function formatMonth(value: string, language: Language) {
  const [year, month] = value.split("-").map(Number)
  if (!month) return String(year)
  return new Intl.DateTimeFormat(locale(language), { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  )
}

/** A role's dates: "Oct 2026 – now", "2024 – 2025", or just "2025". */
export function formatPeriod(start: string, end: string | undefined, language: Language, present: string) {
  if (end === start) return formatMonth(start, language)
  return `${formatMonth(start, language)} – ${end ? formatMonth(end, language) : present}`
}

// Months counted from year 0, for drawing roles on a time axis. A bare year
// covers the whole year: it starts in January and ends after December.
export function monthStart(value: string) {
  const [year, month] = value.split("-").map(Number)
  return year * 12 + (month ? month - 1 : 0)
}
