import type { Language } from "@/lib/i18n"

export const eggsContent: Record<
  Language,
  {
    /** Words that, typed anywhere on the page, trigger an egg. */
    words: { hello: string[]; gravity: string[] }
    /** What the name spells back after "hello". */
    greeting: string[]
    /** The tab's title while the visitor is away. */
    away: string
    broke: { title: string; note: string }
  }
> = {
  en: {
    words: { hello: ["hello", "hallo"], gravity: ["gravity", "schwerkraft"] },
    greeting: ["hello", "you."],
    away: "● ● ● come back",
    broke: { title: "you broke it.", note: "putting it back together" },
  },
  de: {
    words: { hello: ["hallo", "hello"], gravity: ["schwerkraft", "gravity"] },
    greeting: ["hallo", "du."],
    away: "● ● ● komm zurück",
    broke: { title: "kaputt gemacht.", note: "wird wieder zusammengesetzt" },
  },
}
