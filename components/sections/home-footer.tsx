"use client"

import { SiteFooter } from "@/components/site-footer"
import { GlobeHorizon } from "@/components/visitor-globe"
import { column } from "@/lib/styles"

// The end of the home page, and the only footer on the site.
export function HomeFooter() {
  return (
    <section className="px-6 pt-16 md:px-12 md:pt-24">
      <div className={column}>
        <SiteFooter globe />
      </div>
      {/* Wide screens: the globe rises under the footer, edge to edge; the
          footer's own line already says where people came from. */}
      <GlobeHorizon screens="wide" pill={false} className="mt-6 hidden h-72 lg:block" />
    </section>
  )
}
