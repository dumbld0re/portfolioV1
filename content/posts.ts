import type { Language } from "@/lib/i18n"

export const postsContent: Record<
  Language,
  {
    label: string
    tagline: string
    emptyState: string
  }
> = {
  de: {
    label: "Beiträge",
    tagline: "gedanken? notizen? schimpftiraden?",
    emptyState: "Noch keine Beiträge — ein digitaler Garten im Aufbau.",
  },
  en: {
    label: "Posts",
    tagline: "thoughts? notes? rants?",
    emptyState: "No posts yet — a digital garden still growing.",
  },
  it: {
    label: "Articoli",
    tagline: "pensieri? appunti? sfoghi?",
    emptyState: "Ancora nessun articolo — un giardino digitale che sta crescendo.",
  },
}
