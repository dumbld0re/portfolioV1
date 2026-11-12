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
  it: "IT — passa all'italiano",
}

/** The same page, in another language. */
function LanguageLink({
  code,
  className,
  children,
}: {
  code: Language
  className?: string
  children: React.ReactNode
}) {
  const pathname = stripLanguage(usePathname())
  return (
    <Link
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
      {children}
    </Link>
  )
}

// Every language side by side, the current one marked: the corner of the
// screen and the footer, so the language can be changed from anywhere.
export function LanguageSwitch({
  className,
  currentClassName,
}: {
  className?: string
  /** Spacing for the current language's (unlinked) code, to match the links. */
  currentClassName?: string
}) {
  const { language } = useLanguage()
  return (
    <>
      {LANGUAGES.map((code) =>
        code === language ? (
          <span key={code} aria-current="true" className={cn("text-foreground", currentClassName)}>
            {code}
          </span>
        ) : (
          <LanguageLink key={code} code={code} className={className}>
            {code}
          </LanguageLink>
        ),
      )}
    </>
  )
}

// The top bar's single toggle: it shows the current language and each click
// moves on to the next one (de → en → it → de). Hovering rolls the code up to
// show where a click goes (.roll-text in globals.css).
export function LanguageCycle({ className }: { className?: string }) {
  const { language } = useLanguage()
  const next = LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length]
  return (
    <LanguageLink code={next} className={cn("inline-flex", className)}>
      <span className="roll-text" aria-hidden="true">
        <span>{language}</span>
        <span>{next}</span>
      </span>
    </LanguageLink>
  )
}
