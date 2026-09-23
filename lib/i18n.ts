export const LANGUAGES = ["de", "en"] as const

export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = "en"
export const LANGUAGE_COOKIE = "lang_pref"

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language)
}

// English lives at the unprefixed URLs (proxy.ts rewrites them to /en
// internally); every other language gets a /<lang> prefix.
export function localizePath(language: Language, path: string) {
  if (language === DEFAULT_LANGUAGE) return path
  // "/" and "/#contact" attach to the bare prefix ("/de", "/de#contact")
  // rather than "/de/", which would redirect and drop the hash.
  return path === "/" || path.startsWith("/#") ? `/${language}${path.slice(1)}` : `/${language}${path}`
}

// "/de/cv" -> "/cv", "/de" -> "/", "/cv" -> "/cv"
export function stripLanguage(pathname: string) {
  const [, first, ...rest] = pathname.split("/")
  if (!isLanguage(first)) return pathname
  return `/${rest.join("/")}`
}
