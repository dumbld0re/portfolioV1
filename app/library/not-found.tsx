import type { Metadata } from "next"
import Link from "next/link"

import { LibraryShell } from "@/components/library/library-shell"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <LibraryShell>
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="text-center space-y-6">
          <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">404</span> / not on the shelf
          </h1>
          <p className="font-mono text-heading font-semibold tracking-tight">
            grep: no matching entry
            <span aria-hidden="true" className="motion-safe:animate-caret-blink">
              ▍
            </span>
          </p>
          <Link href="/" className="inline-block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
            cd ~/library
          </Link>
        </div>
      </main>
    </LibraryShell>
  )
}
