"use client"

import { useSyncExternalStore } from "react"

import { SiteFooter } from "@/components/site-footer"
import { GlobeHorizon } from "@/components/visitor-globe"
import * as loop from "@/lib/loop-store"
import { column } from "@/lib/styles"
import { cn } from "@/lib/utils"

// The end of the home page, and the only footer on the site.
export function HomeFooter() {
  const looping = useSyncExternalStore(loop.subscribe, loop.getSnapshot, loop.getServerSnapshot)
  return (
    <section className="px-6 pt-16 md:px-12 md:pt-24">
      <div className={column}>
        <SiteFooter globe />
      </div>
      {/* Wide screens: the globe rises under the footer, edge to edge; the
          footer's own line already says where people came from. While the
          page loops (∞) the box grows to hold the same ball whole (its
          radius is min(30vw, 460px), 22px from the top: visitor-globe/engine.ts),
          and the top of the page comes round under it. */}
      <GlobeHorizon
        screens="wide"
        pill={false}
        className={cn("mt-6 hidden lg:block", looping ? "h-[calc(min(30vw,460px)*2+44px)]" : "h-72")}
      />
    </section>
  )
}
