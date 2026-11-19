import type { Language } from "@/lib/i18n"

// Client-safe: a post (or its list entry) in the reader's language, falling
// back to the English text when there's no translation file for it.
export function inLanguage<T extends { translations: Partial<Record<Language, object>> }>(
  post: T,
  language: Language,
): T {
  const translation = post.translations[language]
  return translation ? { ...post, ...translation } : post
}
