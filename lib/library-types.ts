import type { TopicId } from "@/content/library-topics"

// Shared by the server loader (lib/library.ts) and the client index, which
// can't import the loader's Node APIs.
export const ENTRY_KINDS = ["essay", "paper", "book", "talk"] as const
export const ENTRY_STATUSES = ["read", "reading", "queued"] as const

export type EntryKind = (typeof ENTRY_KINDS)[number]
export type EntryStatus = (typeof ENTRY_STATUSES)[number]

export type LibraryEntry = {
  slug: string
  /** Topic code plus position in that topic by date added, e.g. "AI.003". */
  callNumber: string
  title: string
  author: string
  url: string
  kind: EntryKind
  topic: TopicId
  year: number | null
  minutes: number
  status: EntryStatus
  added: string
  finished: string | null
  /** Rendered markdown body — personal notes, empty when there are none. */
  notesHtml: string
}

export type LibraryStats = {
  total: number
  hours: number
  reading: number
  read: number
}
