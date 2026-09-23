import type React from "react"

// Next remounts template.tsx on every navigation, giving each route a
// consistent enter fade without restructuring the per-page LayoutWrapper.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-fade">{children}</div>
}
