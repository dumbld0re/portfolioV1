import type React from "react"
import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "master's thesis",
  robots: { index: false, follow: true },
}

export default function MastersThesisLayout({ children }: { children: React.ReactNode }) {
  return children
}
