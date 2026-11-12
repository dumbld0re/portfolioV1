"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { useLanguage } from "@/components/language-provider"
import { eggsContent } from "@/content/eggs"
import { SECRETS, getServerSnapshot, getSnapshot, resetSecrets, subscribe } from "@/lib/secrets"
import { cn } from "@/lib/utils"

// "secrets 3/15" in the footer. Opened, it lists what has been found (the
// rest stay "???"); with all of them found it offers a wallpaper of the name.
export function SecretsCount({ className, buttonClassName }: { className?: string; buttonClassName?: string }) {
  const { language } = useLanguage()
  const t = eggsContent[language].secrets
  const found = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLSpanElement>(null)
  const all = found.length === SECRETS.length

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <span ref={box} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="secrets-list"
        onClick={() => setOpen((o) => !o)}
        className={cn("cursor-pointer tabular-nums transition-colors hover:text-foreground", buttonClassName)}
      >
        {t.label} <span className={all ? "text-primary" : undefined}>{found.length}/{SECRETS.length}</span>
      </button>
      {open && (
        <span
          id="secrets-list"
          className="absolute bottom-[calc(100%+10px)] left-0 z-40 block w-64 text-left max-lg:left-1/2 max-lg:-translate-x-1/2 rounded-xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg"
        >
          <ol className="space-y-1">
            {SECRETS.map((id) => (
              <li key={id} className={cn("flex gap-2", !found.includes(id) && "text-muted-foreground")}>
                <span aria-hidden="true">{found.includes(id) ? "●" : "○"}</span>
                {found.includes(id) ? t.names[id] : t.unknown}
              </li>
            ))}
          </ol>
          <span className="mt-3 flex justify-between gap-3 border-t border-border pt-2">
            <button type="button" className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={resetSecrets}>
              {t.again}
            </button>
            {all && (
              <button type="button" className="cursor-pointer text-primary" onClick={() => void downloadWallpaper()}>
                {t.wallpaper} ↓
              </button>
            )}
          </span>
        </span>
      )}
    </span>
  )
}

/** A 2560x1440 picture of the name in dots, in the page's colours, saved as a PNG. */
async function downloadWallpaper() {
  const W = 2560
  const H = 1440
  const cs = getComputedStyle(document.documentElement)
  const bg = cs.getPropertyValue("--background").trim() || "#ffffff"
  const ink = cs.getPropertyValue("--foreground").trim() || "#1c1c1c"
  const accent = cs.getPropertyValue("--primary").trim() || "#9d6610"
  const serif = getComputedStyle(document.querySelector("h1.pt") ?? document.body).fontFamily
  await document.fonts.ready

  const lines = ["danny-miguel", "mittelberger"]
  const size = 300
  const off = document.createElement("canvas")
  off.width = W
  off.height = H
  const o = off.getContext("2d", { willReadFrequently: true })!
  o.font = `400 ${size}px ${serif}`
  o.textAlign = "center"
  o.textBaseline = "alphabetic"
  lines.forEach((line, i) => {
    o.fillStyle = "#fff"
    o.fillText(line, W / 2, H / 2 - 20 + i * size * 0.98)
    const at = line.indexOf("-")
    if (at >= 0) {
      const lw = o.measureText(line).width
      o.fillStyle = "#f00"
      o.textAlign = "left"
      o.fillText("-", W / 2 - lw / 2 + o.measureText(line.slice(0, at)).width, H / 2 - 20 + i * size * 0.98)
      o.textAlign = "center"
    }
  })
  const data = o.getImageData(0, 0, W, H).data

  const out = document.createElement("canvas")
  out.width = W
  out.height = H
  const c = out.getContext("2d")!
  c.fillStyle = bg
  c.fillRect(0, 0, W, H)
  const gap = 7
  for (let y = gap / 2; y < H; y += gap) {
    for (let x = gap / 2; x < W; x += gap) {
      const k = ((y | 0) * W + (x | 0)) * 4
      if (data[k + 3] < 128) continue
      c.fillStyle = data[k + 1] < 120 ? accent : ink
      c.beginPath()
      c.arc(x, y, gap * 0.42, 0, Math.PI * 2)
      c.fill()
    }
  }
  const link = document.createElement("a")
  link.download = "danny-miguel-dots.png"
  link.href = out.toDataURL("image/png")
  link.click()
}
