import type React from "react"
import type { Metadata, Viewport } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "don't click here",
  robots: { index: false, follow: true },
}

// Pre-hydration chrome color for the inverted page (mirrors --foreground);
// ThemeColorSync corrects it to the site's chosen theme afterwards.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c1c1c" },
    { media: "(prefers-color-scheme: dark)", color: "#ebdbb2" },
  ],
}

export default function DontClickHereLayout({ children }: { children: React.ReactNode }) {
  return children
}
