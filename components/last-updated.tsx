"use client"

import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"
import { formatPostDate } from "@/lib/format-date"
import { ViewCount } from "@/components/view-count"
import { cn } from "@/lib/utils"

/**
 * "last updated 3 november 2026 | <eye> 150": the date is stamped at build time
 * in next.config.mjs. Below wide screens the count moves to the right edge of
 * the line (and loses its divider), so a long date never wraps it away.
 */
export function LastUpdated({ className }: { className?: string }) {
  const { language } = useLanguage()
  const date = process.env.LAST_UPDATED
  if (!date) return null
  return (
    <p className={cn("flex items-baseline justify-between gap-x-8 lg:block", className)}>
      <span>
        {siteCopy[language].lastUpdated} <time dateTime={date} className="whitespace-nowrap">{formatPostDate(date, language).toLowerCase()}</time>
      </span>
      <ViewCount />
    </p>
  )
}
