"use client"

import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"
import { formatPostDate } from "@/lib/format-date"

/** "last updated 3 november 2026": the date is stamped at build time in next.config.mjs. */
export function LastUpdated({ className }: { className?: string }) {
  const { language } = useLanguage()
  const date = process.env.LAST_UPDATED
  if (!date) return null
  return (
    <p className={className}>
      {siteCopy[language].lastUpdated} <time dateTime={date}>{formatPostDate(date, language).toLowerCase()}</time>
    </p>
  )
}
