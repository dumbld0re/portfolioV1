import type { Language } from "@/lib/i18n"

export const postsContent: Record<
  Language,
  {
    label: string
    tagline: string
    emptyState: string
    minRead: string
    publishedLabel: string
    readingLabel: string
  }
> = {
  de: {
    label: "Beiträge",
    tagline: "gedanken? notizen? schimpftiraden?",
    emptyState: "Noch keine Beiträge — ein digitaler Garten im Aufbau.",
    minRead: "Min. Lesezeit",
    publishedLabel: "Veröffentlicht",
    readingLabel: "Lesezeit",
  },
  en: {
    label: "Posts",
    tagline: "thoughts? notes? rants?",
    emptyState: "No posts yet — a digital garden still growing.",
    minRead: "min read",
    publishedLabel: "Published",
    readingLabel: "Reading",
  },
  it: {
    label: "Articoli",
    tagline: "pensieri? appunti? sfoghi?",
    emptyState: "Ancora nessun articolo — un giardino digitale che sta crescendo.",
    minRead: "min di lettura",
    publishedLabel: "Pubblicato",
    readingLabel: "Lettura",
  },
}
