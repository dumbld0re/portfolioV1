import type { Language } from "@/lib/i18n"

// Words for the visitor globe (components/visitor-globe).
export const globeContent: Record<
  Language,
  {
    title: string
    /** "243 visitors · 37 countries" */
    summary: (people: string, countries: number) => string
    /** The footer pill on phones: "seen in 37 countries". */
    pill: (countries: number) => string
    you: string
    hint: string
    close: string
    open: string
    visitors: (n: number) => string
    none: string
    since: string
    /** Visitors with no known country, last in the list. */
    elsewhere: string
  }
> = {
  de: {
    title: "wer schon hier war",
    summary: (p, c) => `${p} besucher · ${c} länder`,
    pill: (c) => `gesehen in ${c} ländern`,
    you: "du",
    hint: "drehen, zoomen, auf ein land tippen",
    close: "schließen",
    open: "globus mit den besuchern öffnen",
    visitors: (n) => (n === 1 ? "1 besucher" : `${n} besucher`),
    none: "noch niemand von hier",
    since: "seit oktober 2026",
    elsewhere: "irgendwo anders",
  },
  en: {
    title: "who's been here",
    summary: (p, c) => `${p} visitors · ${c} countries`,
    pill: (c) => `seen in ${c} countries`,
    you: "you",
    hint: "drag to spin, pinch to zoom, tap a country",
    close: "close",
    open: "open the globe of visitors",
    visitors: (n) => (n === 1 ? "1 visitor" : `${n} visitors`),
    none: "nobody from here yet",
    since: "since october 2026",
    elsewhere: "somewhere else",
  },
  it: {
    title: "chi è passato di qui",
    summary: (p, c) => `${p} visitatori · ${c} paesi`,
    pill: (c) => `visto in ${c} paesi`,
    you: "tu",
    hint: "trascina, avvicina, tocca un paese",
    close: "chiudi",
    open: "apri il globo dei visitatori",
    visitors: (n) => (n === 1 ? "1 visitatore" : `${n} visitatori`),
    none: "ancora nessuno da qui",
    since: "da ottobre 2026",
    elsewhere: "altrove",
  },
}
