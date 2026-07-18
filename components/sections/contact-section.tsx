"use client"

import Link from "next/link"
import { ArrowUp } from "lucide-react"

import { contactContent } from "@/content/contact"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  const copy = siteCopy[language]
  const whatsapp = `https://wa.me/${t.phone.replace(/[^\d]/g, "")}`

  const linkClass = "text-primary transition-opacity hover:opacity-60"
  const divider = (
    <span className="text-muted-foreground/40" aria-hidden="true">
      /
    </span>
  )

  return (
    <section id="contact" className="contact-footer scroll-mt-20 px-6 pt-24 pb-20 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">004</span> / {t.title}
        </h2>

        <h3 className="mt-8 max-w-2xl font-sans text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          {t.heading}
        </h3>

        <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
          {t.blurbBefore}{" "}
          <a href={`mailto:${t.email}`} className="text-primary underline-offset-4 hover:underline break-words">
            {t.email}
          </a>{" "}
          {t.blurbAfter}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm uppercase tracking-[0.15em]">
          <Link href="/cv" className={linkClass}>
            {copy.nav.cv}
          </Link>
          {divider}
          <a href="https://github.com/dumbld0re" target="_blank" rel="noreferrer" className={linkClass}>
            GitHub
          </a>
          {divider}
          <a href={whatsapp} target="_blank" rel="noreferrer" className={linkClass}>
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-60"
        >
          <ArrowUp className="size-4" />
          {t.backToTop}
        </button>

        <p className="mt-20 font-mono text-xs text-muted-foreground/50">
          {copy.footer}{" "}
          <Link href="/dont-click-here" className="transition-colors hover:text-muted-foreground">
            {copy.dontClickHere}
          </Link>
        </p>
      </div>
    </section>
  )
}
