"use client"

import Link from "next/link"

import { contactContent } from "@/content/contact"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-6">
          <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">004</span> / {t.title}
          </h2>
          <p className="font-serif text-2xl md:text-3xl leading-snug font-medium text-balance">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3 p-6 border border-border rounded-lg w-full bg-card/40">
            <p className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{t.emailLabel}</p>
            <a
              href={`mailto:${t.email}`}
              className="block font-serif text-xl sm:text-2xl md:text-3xl text-foreground underline-offset-4 hover:underline break-words"
            >
              {t.email}
            </a>
            <Button size="lg" asChild className="w-full">
              <Link href={`mailto:${t.email}`}>{t.cta}</Link>
            </Button>
          </div>

          <div className="space-y-3 p-6 border border-border rounded-lg w-full bg-card/40">
            <p className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{t.phoneLabel}</p>
            <a
              href={`tel:${t.phone.replace(/\s+/g, "")}`}
              className="block font-serif text-2xl md:text-3xl text-foreground underline-offset-4 hover:underline"
            >
              {t.phone}
            </a>
            <Button size="lg" asChild variant="outline" className="w-full">
              <Link href={`https://wa.me/${t.phone.replace(/[^\d]/g, "")}`} target="_blank">
                {t.phoneCta}
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{t.footnote}</p>
      </div>
    </section>
  )
}
