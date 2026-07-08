import type { Language } from "@/lib/i18n"

export const postsContent: Record<
  Language,
  {
    label: string
    emptyState: string
  }
> = {
  de: {
    label: "Beiträge",
    emptyState: "Noch keine Beiträge — ein digitaler Garten im Aufbau.",
  },
  en: {
    label: "Posts",
    emptyState: "No posts yet — a digital garden still growing.",
  },
}
