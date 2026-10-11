import type React from "react"

import { AsciiBackground } from "@/components/ascii-background"
import { GhostName } from "@/components/ghost-name"
import { LibraryHeader } from "@/components/library/library-header"
import { libraryCopy } from "@/content/library-topics"

// The library's LayoutWrapper: same dot background and ghost word treatment as
// the portfolio, with the library header and a plain footer.
export function LibraryShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <GhostName text={libraryCopy.ghost} />
        <LibraryHeader />
        {children}
        <footer className="w-full px-6 py-6 text-center text-xs text-muted-foreground print:hidden">
          <p>2086© (so i dont forget to ever change this)</p>
        </footer>
      </div>
    </div>
  )
}
