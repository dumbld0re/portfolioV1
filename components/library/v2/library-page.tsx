"use client"

import { ShelfLibrary } from "@/components/library/v2/shelf"
import { LibraryFrame } from "@/components/library/v2/shared"
import type { LibraryEntry, LibraryStats } from "@/lib/library-types"

// The reading library (dannymiguel.com/read): the shelf, in the main site's frame.
export function LibraryPage({ entries, stats }: { entries: LibraryEntry[]; stats: LibraryStats }) {
  return (
    <LibraryFrame>
      <ShelfLibrary entries={entries} stats={stats} />
    </LibraryFrame>
  )
}
