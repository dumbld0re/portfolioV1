"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { exploreContent } from "@/content/explore"
import { projectsContent } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import type { ShelfItem } from "@/components/explore/shelf"
import { inlineLink } from "@/lib/styles"
import { cn } from "@/lib/utils"

const note = "font-mono text-xs text-muted-foreground"

// The far column: whatever was picked, read in place. A post in full, a
// project with its screens, a book with my notes on it.
export function ItemView({ item, className }: { item: ShelfItem; className?: string }) {
  const { language, localize } = useLanguage()
  const t = exploreContent[language]

  if (item.post) {
    const post = item.post
    return (
      <article className={className}>
        <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-balance md:text-4xl">{post.title}</h2>
        {item.meta && <time dateTime={post.date} className={cn(note, "mt-3 block")}>{item.meta}</time>}
        <div className="post-prose mt-10 text-lg" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    )
  }

  if (item.project) {
    const p = item.project
    const labels = projectsContent[language]
    const screens = p.preview.kind === "screens" ? p.preview.screens : []
    return (
      <article className={className}>
        <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] md:text-4xl">{p.title}</h2>
        {p.short && <p className="mt-3 text-muted-foreground">{p.short}</p>}
        {/* Screens only: a tool without a UI goes straight to its text. */}
        <div className={cn("space-y-4", screens.length > 0 && "mt-8")}>
          {screens.slice(0, 2).map((s) => (
            <Image
              key={s.src}
              src={s.src}
              width={s.width}
              height={s.height}
              alt={`${p.title}, ${s.name ?? ""}`}
              sizes="(min-width: 1024px) 40rem, 100vw"
              // A bar widget's panel stays near its real size instead of filling the column.
              style={{ maxWidth: s.bare ? s.width / 2 : undefined }}
              className={cn("w-full", !s.bare && "rounded-lg border border-border")}
            />
          ))}
        </div>
        <p className="mt-8 text-lg leading-relaxed">{p.description}</p>
        <p className={cn(note, "mt-6")}>{p.tech.join(" · ").toLowerCase()}</p>
        {p.install && <InstallLine lines={p.install} />}
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          {p.demoHref && (
            <a href={p.demoHref} target="_blank" rel="noreferrer" className={inlineLink}>
              {(p.demoKind === "site" ? labels.viewSiteLabel : labels.viewDemoLabel).toLowerCase()} ↗
            </a>
          )}
          {p.githubHref && (
            <a href={p.githubHref} target="_blank" rel="noreferrer" className={inlineLink}>
              {labels.viewSourceLabel.toLowerCase()} ↗
            </a>
          )}
          {p.slug && !p.demoOnly && (
            <Link href={localize(`/projects/${p.slug}`)} className={inlineLink}>
              {t.fullCase} →
            </Link>
          )}
        </p>
      </article>
    )
  }

  if (item.book) {
    const b = item.book
    return (
      <article className={className}>
        <div className="flex items-start gap-6">
          {b.cover && (
            <Image src={b.cover} width={240} height={360} alt="" className="w-24 shrink-0 rounded-sm border border-border md:w-28" />
          )}
          <div>
            <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-balance">{b.title}</h2>
            <p className="mt-2 text-muted-foreground">{b.author.toLowerCase()}</p>
            <p className={cn(note, "mt-3")}>
              {[b.kind, b.year, `${b.minutes} ${t.minutes}`, t.status[b.status]].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        {b.notesHtml ? (
          <div className="post-prose mt-10 text-lg" dangerouslySetInnerHTML={{ __html: b.notesHtml }} />
        ) : (
          <p className="mt-10 text-muted-foreground">{t.noNotes}</p>
        )}
        <p className="mt-8 font-mono text-sm">
          <a href={b.url} target="_blank" rel="noreferrer" className={inlineLink}>
            {t.readIt} ↗
          </a>
        </p>
      </article>
    )
  }

  return null
}

/** A tool's install commands, with a way to copy them all. */
function InstallLine({ lines }: { lines: string[] }) {
  const command = lines.join("\n")
  const { language } = useLanguage()
  const t = exploreContent[language]
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(command).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      },
      () => {},
    )
  }

  return (
    <div className="mt-6 rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
        <span>{t.install}</span>
        <button type="button" onClick={copy} className="transition-colors hover:text-foreground">
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <code className="block space-y-1.5 overflow-x-auto whitespace-nowrap px-4 py-3 font-mono text-xs">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </code>
    </div>
  )
}

/** A list row that is only a link goes there; the rest open in place. */
export function itemOpens(item: ShelfItem) {
  return !item.href
}
