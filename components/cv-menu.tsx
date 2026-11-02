"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, Download } from "lucide-react"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

const CV_PDF = "/cv.pdf"
const GAP = 10
const GUTTER = 16
const noop = () => () => {}

// The CV is a PDF, not a page: clicking "cv" drops a small menu with two ways
// to get at it. The menu is portalled to <body> and positioned against the
// trigger, so the phone nav's sideways scroller can't clip it.
export function CvMenu({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  /** Accessible name when the trigger shows only an icon. */
  label?: string
}) {
  const { language } = useLanguage()
  const copy = siteCopy[language]
  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  // false on the server, true once hydrated: the portal needs document.body.
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const place = useCallback(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return
    const rect = trigger.getBoundingClientRect()
    const width = menu.offsetWidth
    const max = window.innerWidth - GUTTER - width
    setPos({ top: rect.bottom + GAP, left: Math.max(GUTTER, Math.min(rect.left, max)) })
  }, [])

  useLayoutEffect(() => {
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      close()
      triggerRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    window.addEventListener("resize", close)
    window.addEventListener("scroll", close, { passive: true })
    // Move focus to the first option so keyboard users land inside.
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", close)
      window.removeEventListener("scroll", close)
    }
  }, [open])

  const onMenuKey = (event: ReactKeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
    event.preventDefault()
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    const next = event.key === "ArrowDown" ? i + 1 : i - 1
    items[(next + items.length) % items.length]?.focus()
  }

  const item =
    "group/item flex items-center justify-between gap-6 rounded-md px-3 py-2 font-mono text-sm lowercase text-muted-foreground outline-none transition-[color,background-color,opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground"
  // Each row follows the panel in, a beat apart (transitionDelay below).
  const row = cn(item, open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0")

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((v) => !v)}
        className={className}
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            onKeyDown={onMenuKey}
            data-state={open ? "open" : "closed"}
            style={pos ? { top: pos.top, left: pos.left } : undefined}
            className={cn(
              "fixed z-50 min-w-52 origin-top-left rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)]",
              "transition-[opacity,scale,translate,visibility] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
              open
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible pointer-events-none -translate-y-1.5 scale-[0.97] opacity-0",
            )}
          >
            <a
              role="menuitem"
              href={CV_PDF}
              download="danny-miguel-mittelberger-cv.pdf"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={row}
              style={{ transitionDelay: open ? "40ms" : "0ms" }}
            >
              {copy.cvDownload}
              <Download className="size-3.5 transition-transform duration-300 group-hover/item:translate-y-0.5 group-hover/item:text-primary" />
            </a>
            <a
              role="menuitem"
              href={CV_PDF}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={row}
              style={{ transitionDelay: open ? "80ms" : "0ms" }}
            >
              {copy.cvOpen}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-primary" />
            </a>
          </div>,
          document.body,
        )}
    </>
  )
}
