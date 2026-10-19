import type { Language } from "@/lib/i18n"

export const postsContent: Record<
  Language,
  {
    label: string
    emptyState: string
    minRead: string
    publishedLabel: string
    readingLabel: string
  }
> = {
  de: {
    label: "Beiträge",
    emptyState: "Noch keine Beiträge — ein digitaler Garten im Aufbau.",
    minRead: "Min. Lesezeit",
    publishedLabel: "Veröffentlicht",
    readingLabel: "Lesezeit",
  },
  en: {
    label: "Posts",
    emptyState: "No posts yet — a digital garden still growing.",
    minRead: "min read",
    publishedLabel: "Published",
    readingLabel: "Reading",
  },
}
