import type { Metadata } from "next"
import Link from "next/link"

import { LayoutWrapper } from "@/components/layout-wrapper"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <LayoutWrapper>
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="text-center space-y-6">
          <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">404</span> / not found
          </h1>
          <p className="font-mono text-heading font-semibold tracking-tight">
            bash: no such file or directory
            <span aria-hidden="true" className="motion-safe:animate-caret-blink">
              ▍
            </span>
          </p>
          <Link
            href="/"
            className="inline-block font-mono text-sm uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-60"
          >
            cd ~
          </Link>
        </div>
      </main>
    </LayoutWrapper>
  )
}
