"use client"

import { createContext, useContext, type ReactNode } from "react"

import { LANGUAGE_COOKIE, localizePath, type Language } from "@/lib/i18n"

type LanguageContextValue = {
  language: Language
  /** Prefixes an internal path for the current language ("/cv" -> "/de/cv"). */
  localize: (path: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

type LanguageProviderProps = {
  children: ReactNode
  language: Language
}

// The language comes from the URL (app/[lang]); this only hands it down to the
// client sections along with a helper for building links in that language.
export function LanguageProvider({ children, language }: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={{ language, localize: (path) => localizePath(language, path) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}

/** Remembers an explicit language choice so proxy.ts stops redirecting by browser language. */
export function rememberLanguage(language: Language) {
  document.cookie = `${LANGUAGE_COOKIE}=${language};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
}
