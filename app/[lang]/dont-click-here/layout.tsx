import type React from "react"
import type { Metadata, Viewport } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "don't click here",
  robots: { index: false, follow: true },
}

// Pre-hydration chrome color for the page (mirrors --egg-bg in globals.css);
// ThemeColorSync takes over after hydration.
export const viewport: Viewport = {
  themeColor: "#d79921",
}

export default function DontClickHereLayout({ children }: { children: React.ReactNode }) {
  return children
}
