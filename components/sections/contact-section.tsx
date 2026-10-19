"use client"

import Link from "next/link"
import { ArrowUp, ArrowUpRight } from "lucide-react"

import { contactContent } from "@/content/contact"
import { siteCopy } from "@/content/site"
import { BoringToggle } from "@/components/boring-toggle"
import { DontClickLink } from "@/components/dont-click-link"
import { useLanguage } from "@/components/language-provider"
import { LocalClock } from "@/components/local-clock"
import { RollText } from "@/components/roll-text"

export function ContactSection() {
  const { language, localize } = useLanguage()
  const t = contactContent[language]
  const copy = siteCopy[language]
  const whatsapp = `https://wa.me/${t.phone.replace(/[^\d]/g, "")}`

  // Underline sweeps in from the left on hover.
  const linkClass =
    "group/l relative inline-flex items-center gap-1.5 w-fit after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
  const arrow = <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/l:rotate-45" />
  const colLabel = "font-mono text-label uppercase tracking-[0.3em] text-muted-foreground"

  return (
    <section id="contact" className="contact-footer scroll-mt-20 overflow-hidden px-6 md:px-12 lg:px-16 pt-24 pb-10 md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <h2 className={colLabel}>
          <span className="text-primary">004</span> / {t.title}
        </h2>

        <p
          data-reveal
          className="mt-10 font-serif lowercase leading-[0.85] tracking-[-0.04em] text-[clamp(3.5rem,11.5vw,13rem)] text-balance"
        >
          {t.heading.replace(/\.$/, "")}
          <span className="text-primary">.</span>
        </p>

        <div data-reveal className="mt-14 md:mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            {t.blurbBefore}
          </p>
          <a
            href={`mailto:${t.email}`}
            className="group relative inline-flex items-center gap-3 font-serif text-[clamp(1.5rem,0.8rem+2.6vw,3.5rem)] leading-none break-all text-foreground"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-2 after:h-[2px] after:origin-right after:scale-x-100 after:bg-primary after:transition-transform after:duration-500 after:ease-out group-hover:after:origin-left group-hover:after:animate-underline-redraw">
              {t.email}
            </span>
            <ArrowUpRight className="size-[0.8em] shrink-0 text-primary transition-transform duration-500 group-hover:rotate-45" />
          </a>
        </div>

        <div data-reveal className="relative mt-20 md:mt-28 grid grid-cols-2 gap-10 pt-8 md:grid-cols-4">
          <span aria-hidden="true" className="line-draw absolute inset-x-0 top-0 h-px bg-border" />
          <div className="space-y-4">
            <h3 className={colLabel}>{t.writeLabel}</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href={`mailto:${t.email}`} className={linkClass}>
                  <RollText>E-Mail</RollText> {arrow}
                </a>
              </li>
              <li>
                <a href={whatsapp} target="_blank" rel="noreferrer" className={linkClass}>
                  <RollText>WhatsApp</RollText> {arrow}
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className={colLabel}>{t.elsewhereLabel}</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href="https://github.com/dumbld0re" target="_blank" rel="noreferrer" className={linkClass}>
                  <RollText>GitHub</RollText> {arrow}
                </a>
              </li>
              <li>
                <Link href={localize("/cv")} className={linkClass}>
                  <RollText>{copy.nav.cv}</RollText> {arrow}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className={colLabel}>{t.localTimeLabel}</h3>
            <LocalClock className="block font-mono text-sm" showPlace />
          </div>
          <div className="space-y-4 md:text-right">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] text-primary"
            >
              <ArrowUp className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-1" />
              <RollText>{t.backToTop}</RollText>
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 md:flex-row md:items-center md:justify-between font-mono text-xs text-muted-foreground">
          <p>{copy.footer}</p>
          <DontClickLink className="transition-colors hover:text-foreground">{copy.dontClickHere}</DontClickLink>
          <div className="mt-4 md:hidden">
            <BoringToggle />
          </div>
        </div>
      </div>
    </section>
  )
}
