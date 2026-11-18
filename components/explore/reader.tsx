"use client"

import { useEffect, useState, type ReactNode } from "react"

import { exploreContent, type SectionId } from "@/content/explore"
import { useLanguage } from "@/components/language-provider"
import { ItemView } from "@/components/explore/item-view"
import type { ShelfItem, ShelfSection } from "@/components/explore/shelf"
import { cn } from "@/lib/utils"

// The place you land in after picking something, in three columns: what you
// picked (lead), its title, line and list, then the open item. Opening an item
// widens the row, so the first two slide left to make room; the other rows
// fade back. Phones show one column at a time with a way back.

/** Text that types itself in, a few letters a frame. Restarts when it changes. */
export function TypeIn(props: { text: string; speed?: number; className?: string }) {
  return <Typing key={props.text} {...props} />
}

function Typing({ text, speed = 2, className }: { text: string; speed?: number; className?: string }) {
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 0,
  )
  useEffect(() => {
    let raf = 0
    let n = 0
    const step = () => {
      n = Math.min(text.length, n + speed)
      setShown((s) => Math.max(s, n))
      if (n < text.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [text, speed])

  return (
    <span className={className}>
      <span>{text.slice(0, shown)}</span>
      {/* The rest holds its place, so the lines never reflow as it types. */}
      <span className="invisible" aria-hidden="true">{text.slice(shown)}</span>
    </span>
  )
}

export function ListRow({
  item,
  active,
  dim,
  onOpen,
}: {
  item: ShelfItem
  active: boolean
  dim: boolean
  onOpen: () => void
}) {
  const label = (
    <>
      <span
        className={cn(
          "font-serif text-xl underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] md:text-[1.375rem]",
          active ? "decoration-primary decoration-2" : "decoration-border group-hover:decoration-primary",
        )}
      >
        {item.title}
      </span>
      {item.meta && <span className="ml-3 font-mono text-xs text-muted-foreground">{item.meta}</span>}
      {item.external && <span className="ml-1 font-mono text-xs text-muted-foreground">↗</span>}
    </>
  )
  const cls = cn("group block py-1.5 text-left lowercase transition-opacity duration-300", dim && !active && "opacity-35 hover:opacity-100")

  return (
    <li>
      {item.href ? (
        <a href={item.href} target={item.external ? "_blank" : undefined} rel="noreferrer" className={cls}>
          {label}
        </a>
      ) : (
        <button type="button" onClick={onOpen} aria-current={active || undefined} className={cls}>
          {label}
        </button>
      )}
    </li>
  )
}

export function SectionPanel({
  section,
  itemId,
  onOpenItem,
  className,
}: {
  section: ShelfSection
  itemId: string | null
  onOpenItem: (id: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="font-serif text-4xl lowercase leading-none tracking-[-0.03em] md:text-5xl">
        <TypeIn text={section.title} speed={1} />
      </h2>
      <p className="mt-5 text-muted-foreground md:text-lg md:leading-relaxed">
        <TypeIn text={section.line} speed={3} />
      </p>
      {section.body?.map((p) => (
        <p key={p} className="mt-4 leading-relaxed lowercase">
          {p}
        </p>
      ))}
      <ul key={section.id} className="explore-rise mt-8 space-y-1">
        {section.items.map((item) => (
          <ListRow
            key={item.id}
            item={item}
            active={item.id === itemId}
            dim={!!itemId}
            onOpen={() => onOpenItem(item.id)}
          />
        ))}
      </ul>
      {section.more && (
        <a href={section.more.href} className="mt-6 inline-block font-mono text-xs text-muted-foreground hover:text-foreground">
          {section.more.label} →
        </a>
      )}
    </div>
  )
}

export function BackButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← {children}
    </button>
  )
}

/** Escape steps out: first the open item, then the place. */
export function useEscape(onEscape: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })
}

export function Reader({
  section,
  itemId,
  lead,
  onOpenItem,
  onCloseItem,
  onClose,
  closeLabel,
  leadPhoneClassName = "w-32",
  className,
}: {
  section: ShelfSection
  itemId: string | null
  /** The left column: what was picked, drawn by each prototype its own way. */
  lead?: ReactNode
  onOpenItem: (s: SectionId, id: string) => void
  onCloseItem: () => void
  onClose: () => void
  closeLabel?: string
  /** The lead's box on phones (a picture stays small, text takes the width). */
  leadPhoneClassName?: string
  className?: string
}) {
  const { language } = useLanguage()
  const t = exploreContent[language]
  const item = section.items.find((i) => i.id === itemId) ?? null

  useEscape(() => (item ? onCloseItem() : onClose()))

  return (
    <div className={cn("px-6 pb-24 md:px-12", className)}>
      {/* Wide screens: three columns that make room for the item (widths in
          app/globals.css, "Explore"). */}
      <div data-open={item ? "" : undefined} className="explore-row mx-auto hidden w-fit items-start lg:flex">
        {lead && <div className="explore-lead sticky top-28 shrink-0">{lead}</div>}
        <div className="sticky top-28 w-[24rem] shrink-0">
          <BackButton onClick={onClose}>{closeLabel ?? t.back}</BackButton>
          <SectionPanel section={section} itemId={itemId} onOpenItem={(id) => onOpenItem(section.id, id)} className="mt-8" />
        </div>
        <div className="explore-item shrink-0 overflow-hidden">
          {item && (
            <div key={item.id} className="explore-item-inner explore-rise pt-[5.5rem]">
              <ItemView item={item} />
            </div>
          )}
        </div>
      </div>

      {/* Phones and tablets: one column at a time. */}
      <div className="mx-auto max-w-2xl lg:hidden">
        {item ? (
          <div key={item.id} className="explore-rise">
            <BackButton onClick={onCloseItem}>{section.title}</BackButton>
            <ItemView item={item} className="mt-8" />
          </div>
        ) : (
          <div key={section.id} className="explore-rise">
            <BackButton onClick={onClose}>{closeLabel ?? t.back}</BackButton>
            {lead && <div className={cn("mt-6", leadPhoneClassName)}>{lead}</div>}
            <SectionPanel section={section} itemId={null} onOpenItem={(id) => onOpenItem(section.id, id)} className="mt-6" />
          </div>
        )}
      </div>
    </div>
  )
}
