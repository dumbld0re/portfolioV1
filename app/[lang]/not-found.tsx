import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { NotFoundSlam } from "@/components/not-found/slam"
import { column } from "@/lib/styles"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
}

// A 404 as wide as the screen slams down onto the page (components/not-found/slam.tsx).
// The same top as the home page: languages and theme, no links.
export default function NotFound() {
  return (
    <LayoutWrapper bar="home">
      <main className="flex flex-1 items-center overflow-x-clip px-6 py-24 md:px-12">
        <div className={column}>
          <NotFoundSlam />
        </div>
      </main>
    </LayoutWrapper>
  )
}
