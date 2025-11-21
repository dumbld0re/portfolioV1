"use client"

import Link from "next/link"

import { contactContent } from "@/content/contact"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]

  return (
    <main className="flex-1 px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="font-mono text-4xl md:text-5xl font-bold uppercase">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.description}</p>
        </div>

        <div className="space-y-8 text-left">
          <div className="space-y-3 p-6 border border-border rounded-lg w-full">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.emailLabel}</p>
            <a
              href={`mailto:${t.email}`}
              className="block font-mono text-xl sm:text-2xl md:text-3xl text-foreground underline-offset-4 hover:underline break-words"
            >
              {t.email}
            </a>
            <Button size="lg" asChild className="font-mono w-full">
              <Link href={`mailto:${t.email}`}>{t.cta}</Link>
            </Button>
          </div>

          <div className="space-y-3 p-6 border border-border rounded-lg w-full">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.phoneLabel}</p>
            <a
              href={`tel:${t.phone.replace(/\s+/g, "")}`}
              className="block font-mono text-2xl md:text-3xl text-foreground underline-offset-4 hover:underline"
            >
              {t.phone}
            </a>
            <Button size="lg" asChild variant="outline" className="font-mono w-full">
              <Link href={`https://wa.me/${t.phone.replace(/[^\d]/g, "")}`} target="_blank">
                {t.phoneCta}
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{t.footnote}</p>
      </div>
    </main>
  )
}


