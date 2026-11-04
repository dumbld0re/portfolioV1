import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { NotFoundLabel } from "@/components/not-found-home-link"
import { column, sectionLabel } from "@/lib/styles"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
}

// Set like a home section: a mono label and a serif line.
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
        </div>
      </main>
    </LayoutWrapper>
  )
}
