import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { NotFoundHomeLink, NotFoundLabel } from "@/components/not-found-home-link"
import { column, sectionLabel } from "@/lib/styles"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
}

// Set like a home section: a mono label, a serif line, a mono way back.
export default function NotFound() {
  return (
    <LayoutWrapper>
      <main className="flex flex-1 items-center px-6 py-24 md:px-12">
        <div className={column}>
          <h1 className={sectionLabel}>
            <span className="text-primary">404</span> / <NotFoundLabel />
          </h1>
          <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] text-balance md:text-7xl">
            no such file or directory<span className="text-primary">.</span>
          </p>
          <p className="mt-10 font-mono text-base text-muted-foreground">
            <span className="text-muted-foreground/50" aria-hidden="true">
              ${" "}
            </span>
            <NotFoundHomeLink />
            <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
              _
            </span>
          </p>
        </div>
      </main>
    </LayoutWrapper>
  )
}
