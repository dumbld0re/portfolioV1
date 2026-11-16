import { LibraryPage } from "@/components/library/v2/library-page"
import { getLibrary, getLibraryStats } from "@/lib/library"

// Rebuilt once a day, so new entries and finished dates show without a deploy.
export const revalidate = 86400

export default function Library() {
  const entries = getLibrary()
  return <LibraryPage entries={entries} stats={getLibraryStats(entries)} />
}
