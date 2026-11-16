import type { Language } from "@/lib/i18n"

// "currently reading → …" under the clock in the contact section
// (components/reading-now.tsx). A placeholder for now: swap in the real
// title and author, or later read it from the library's "reading" entries.
export const readingNow = {
  title: "title goes here",
  author: "author",
}

export const readingNowCopy: Record<Language, { label: string; by: string; shelf: string }> = {
  de: { label: "ich lese gerade", by: "von", shelf: "zum regal" },
  en: { label: "currently reading", by: "by", shelf: "the shelf" },
  it: { label: "sto leggendo", by: "di", shelf: "lo scaffale" },
}
