import { LibraryIndex } from "@/components/library/library-index"
import { LibraryShell } from "@/components/library/library-shell"
import { libraryCopy } from "@/content/library-topics"
import { getLibrary, getLibraryStats } from "@/lib/library"

// Rebuilt once a day: the ledger's window ends at the current month, which
// would otherwise freeze at the last deploy.
export const revalidate = 86400

export default function LibraryPage() {
  const entries = getLibrary()
  const stats = getLibraryStats(entries)

  return (
    <LibraryShell>
      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-16">
          <section className="space-y-4">
            <h1 className="font-serif text-display font-semibold tracking-tight text-balance motion-safe:animate-reveal-up">
              {libraryCopy.title}
            </h1>
            <p
              className="flex items-center gap-3 text-muted-foreground text-sm md:text-base motion-safe:animate-reveal-up"
              style={{ animationDelay: "100ms" }}
            >
              <span className="w-6 h-px bg-primary" aria-hidden="true" />
              <span>
                {stats.total} pieces · {stats.hours} hours · {stats.reading} open
              </span>
            </p>
          </section>

          <LibraryIndex entries={entries} now={new Date().toISOString().slice(0, 7)} />
        </div>
      </main>
    </LibraryShell>
  )
}
