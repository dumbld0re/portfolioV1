"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { rememberLanguage, useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { LANGUAGES, localizePath, stripLanguage, type Language } from "@/lib/i18n"

/** Read out by screen readers, each in its own language. */
const switchTo: Record<Language, string> = {
  en: "EN — switch to English",
  de: "DE — auf Deutsch wechseln",
}

// One link per language: the same page, in other words. Used in the header
// (other languages only) and in the corner of the screen (all of them, the
// current one marked), so the language can be changed from anywhere.
export function LanguageSwitch({
  className,
  currentClassName,
  showCurrent = false,
}: {
  className?: string
  /** Spacing for the current language's (unlinked) code, to match the links. */
  currentClassName?: string
  showCurrent?: boolean
}) {
  const { language } = useLanguage()
  const pathname = stripLanguage(usePathname())
  return (
    <>
      {LANGUAGES.filter((code) => showCurrent || code !== language).map((code) =>
        code === language ? (
          <span key={code} aria-current="true" className={cn("text-foreground", currentClassName)}>
            {code}
          </span>
        ) : (
          <Link
            key={code}
            href={localizePath(code, pathname)}
            onClick={() => rememberLanguage(code)}
            // A prefetch would run before the click stores the cookie, and
            // proxy.ts could answer it with a redirect back to this language.
            prefetch={false}
            // Stay where you are on the page: only the words change.
            scroll={false}
            hrefLang={code}
            className={className}
            aria-label={switchTo[code]}
          >
            {code}
          </Link>
        ),
      )}
    </>
  )
}
