import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"

import { libraryTopics, type TopicId } from "@/content/library-topics"
import { ENTRY_KINDS, ENTRY_STATUSES, type LibraryEntry, type LibraryStats } from "@/lib/library-types"

const LIBRARY_DIR = path.join(process.cwd(), "content/library")

// Frontmatter is hand-written, so fail the build loudly on a typo rather than
// rendering an entry with a missing topic or a NaN reading time.
function parseEntry(slug: string): Omit<LibraryEntry, "callNumber"> {
  const raw = fs.readFileSync(path.join(LIBRARY_DIR, `${slug}.md`), "utf-8")
  const { data, content } = matter(raw)
  const fail = (field: string) => {
    throw new Error(`content/library/${slug}.md: missing or invalid "${field}"`)
  }

  if (typeof data.title !== "string") fail("title")
  if (typeof data.author !== "string") fail("author")
  if (typeof data.url !== "string") fail("url")
  if (!ENTRY_KINDS.includes(data.kind)) fail("kind")
  if (!(data.topic in libraryTopics)) fail("topic")
  if (typeof data.minutes !== "number" || data.minutes <= 0) fail("minutes")
  if (!ENTRY_STATUSES.includes(data.status)) fail("status")
  if (!data.added) fail("added")

  return {
    slug,
    title: data.title,
    author: data.author,
    url: data.url,
    kind: data.kind,
    topic: data.topic,
    year: typeof data.year === "number" ? data.year : null,
    minutes: data.minutes,
    status: data.status,
    added: toDateString(data.added),
    finished: data.finished ? toDateString(data.finished) : null,
    notesHtml: content.trim() ? marked.parse(content, { async: false }) : "",
  }
}

// gray-matter turns unquoted YAML dates into Date objects.
function toDateString(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value)
}

export function getLibrary(): LibraryEntry[] {
  if (!fs.existsSync(LIBRARY_DIR)) return []

  const entries = fs
    .readdirSync(LIBRARY_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseEntry(file.replace(/\.md$/, "")))
    .sort((a, b) => (a.added === b.added ? a.slug.localeCompare(b.slug) : a.added < b.added ? -1 : 1))

  // Numbered in order of addition, so existing call numbers never shift when
  // a new entry lands (unless one is back-dated).
  const counts: Partial<Record<TopicId, number>> = {}
  return entries.map((entry) => {
    const n = (counts[entry.topic] = (counts[entry.topic] ?? 0) + 1)
    return { ...entry, callNumber: `${libraryTopics[entry.topic].code}.${String(n).padStart(3, "0")}` }
  })
}

export function getLibraryStats(entries: LibraryEntry[]): LibraryStats {
  const minutes = entries.filter((e) => e.status !== "queued").reduce((sum, e) => sum + e.minutes, 0)
  return {
    total: entries.length,
    hours: Math.round(minutes / 60),
    reading: entries.filter((e) => e.status === "reading").length,
    read: entries.filter((e) => e.status === "read").length,
  }
}
