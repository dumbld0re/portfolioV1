"use client"

import { createContext, useContext, useState, startTransition, type ReactNode } from "react"

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, type Language } from "@/lib/i18n"

type LanguageContextValue = {
  language: Language
  setLanguage: (next: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

type LanguageProviderProps = {
  children: ReactNode
  defaultLanguage?: Language
}

export function LanguageProvider({ children, defaultLanguage = DEFAULT_LANGUAGE }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)

  const setLanguage = (next: Language) => {
    startTransition(() => {
      setLanguageState(next)
      if (typeof document !== "undefined") {
        document.cookie = `${LANGUAGE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365}`
      }
    })
  }

  const toggleLanguage = () => {
    setLanguage(language === "de" ? "en" : "de")
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
      }}
    >
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

