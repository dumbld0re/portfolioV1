"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { inlineLink } from "@/lib/styles"

const VISITS_KEY = "dont-click-visits"

// It gets a little more exasperated every time you come back. The last line
// stays for everyone who keeps going.
const copy = {
  en: {
    lines: [
      "i said dont click here, silly.",
      "again? it still says dont.",
      "third time. there is nothing new here, i promise.",
      "ok, now you're just testing me.",
      "there is no prize. there has never been a prize.",
      "fine. here's a prize: ▲. happy?",
      "you've been here seven times. i'm starting to worry.",
    ],
    more: (n: number) => `${n} times. we should both go outside.`,
    you: (n: number) => (n === 1 ? "you: once" : `you: ${n} times`),
    everyone: (n: string) => `everyone: ${n} times`,
    back: "ok, take me back",
  },
  de: {
    lines: [
      "ich hab doch gesagt, nicht klicken.",
      "schon wieder? da steht immer noch nicht.",
      "das dritte mal. hier gibt es nichts neues, versprochen.",
      "ok, jetzt testest du mich nur noch.",
      "es gibt keinen preis. es gab nie einen preis.",
      "na gut. hier ist ein preis: ▲. zufrieden?",
      "du warst jetzt sieben mal hier. ich mache mir langsam sorgen.",
    ],
    more: (n: number) => `${n} mal. wir sollten beide mal rausgehen.`,
    you: (n: number) => (n === 1 ? "du: einmal" : `du: ${n} mal`),
    everyone: (n: string) => `alle zusammen: ${n} mal`,
    back: "ok, bring mich zurück",
  },
}

// One count per visit, even when React mounts the page twice in a row in dev.
let visit: { at: number; mine: number; everyone: Promise<number | null> } | null = null

function countVisit() {
  if (visit && Date.now() - visit.at < 1000) return visit
  let mine = 1
  try {
    mine = (Number(localStorage.getItem(VISITS_KEY)) || 0) + 1
    localStorage.setItem(VISITS_KEY, String(mine))
  } catch {}
  const everyone = fetch("/api/clicks", { method: "POST" })
    .then((res) => (res.ok ? res.json() : { clicks: null }))
    .then(({ clicks }: { clicks: number | null }) => clicks)
    .catch(() => null)
  visit = { at: Date.now(), mine, everyone }
  return visit
}

export default function DontClickHerePage() {
  const { language, localize } = useLanguage()
  const t = copy[language]
  // How often this browser has been here; unknown until it has been asked.
  const [mine, setMine] = useState<number | null>(null)
  const [everyone, setEveryone] = useState<number | null>(null)

  useEffect(() => {
    const counted = countVisit()
    // The count lives in the browser, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMine(counted.mine)
    let live = true
    // Never fewer than this browser's own count (a filtered or failed count can lag).
    counted.everyone.then((n) => live && setEveryone(n === null ? null : Math.max(n, counted.mine)))
    return () => {
      live = false
    }
  }, [])

  return (
    <main className="site flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center font-mono text-sm text-foreground">
      {mine !== null && (
        <>
          <p className="motion-safe:animate-reveal-up">{t.lines[mine - 1] ?? t.more(mine)}</p>
          <p className="text-xs text-muted-foreground tabular-nums motion-safe:animate-reveal-up" style={{ animationDelay: "150ms" }}>
            {t.you(mine)}
            {everyone !== null && (
              <>
                <span className="mx-2 opacity-50" aria-hidden="true">
                  |
                </span>
                {t.everyone(everyone.toLocaleString(language === "de" ? "de-DE" : "en-US"))}
              </>
            )}
          </p>
          <Link
            href={localize("/")}
            className={`${inlineLink} text-xs text-muted-foreground motion-safe:animate-reveal-up`}
            style={{ animationDelay: "300ms" }}
          >
            {t.back}
          </Link>
        </>
      )}
    </main>
  )
}
