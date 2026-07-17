"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { ArrowUp, Github, Mail } from "lucide-react"

import { contactContent } from "@/content/contact"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"

// A 30s-bucketed tick: the snapshot only changes every 30s, so the clock
// re-renders on that cadence without churning on every render. The server
// snapshot is a sentinel so hydration matches, then swaps to the real time.
const subscribeClock = (onChange: () => void) => {
  const id = setInterval(onChange, 30_000)
  return () => clearInterval(id)
}
const clockBucket = () => Math.floor(Date.now() / 30_000)
const clockServerBucket = () => -1

// Live clock pinned to the studio's timezone (Windhoek).
function StudioClock({ language }: { language: string }) {
  const bucket = useSyncExternalStore(subscribeClock, clockBucket, clockServerBucket)

  if (bucket < 0) return <span className="tabular-nums">&nbsp;</span>

  const formatted = new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Windhoek",
  }).format(new Date())

  return <span className="tabular-nums lowercase">{formatted}</span>
}

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  const copy = siteCopy[language]

  return (
    <section id="contact" className="contact-footer scroll-mt-20 px-6 pt-20 pb-16 md:pt-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">004</span> / {t.title}
        </h2>

        <p className="mt-10 font-serif text-2xl md:text-3xl italic text-muted-foreground">{t.statement}</p>

        <a
          href={`mailto:${t.email}`}
          className="mt-3 block font-mono font-semibold text-foreground break-all leading-[1.05] text-[clamp(1.5rem,5vw,3rem)] transition-colors hover:text-primary"
        >
          {t.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${t.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 font-mono text-sm text-foreground/80 transition-colors hover:border-primary/60 hover:text-foreground"
          >
            <Mail className="size-4" />
            {t.getInTouch}
          </a>
          <a
            href={`https://wa.me/${t.phone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.phoneCta}
          </a>
          <a
            href="https://github.com/dumbld0re"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 font-mono text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <p className="text-foreground/70">danny-miguel — {t.role}.</p>
            <p>{t.responseTime}</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p>{t.location}</p>
            <p>
              <StudioClock language={language} />
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-border py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copy.footer}{" "}
            <Link href="/dont-click-here" className="text-muted-foreground/25 transition-colors hover:text-muted-foreground">
              {copy.dontClickHere}
            </Link>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 self-start uppercase tracking-[0.2em] transition-colors hover:text-foreground sm:self-auto"
          >
            {t.backToTop}
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
