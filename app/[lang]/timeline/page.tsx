import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TimelinePage } from "@/components/timeline/timeline-page"
import { SHOW_TIMELINE } from "@/lib/features"

// Work in progress with placeholder data: hidden behind SHOW_TIMELINE and kept
// out of search engines. It has its own pinned header and no site footer, so
// it skips LayoutWrapper.
export const metadata: Metadata = {
  title: "timeline",
  robots: { index: false, follow: false },
}

export default function Page() {
  if (!SHOW_TIMELINE) notFound()

  return <TimelinePage />
}
