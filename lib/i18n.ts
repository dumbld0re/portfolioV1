export const LANGUAGES = ["de", "en"] as const

export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = "en"
export const LANGUAGE_COOKIE = "lang_pref"

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language)
}

