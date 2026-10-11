import { libraryTopics, type TopicId } from "@/content/library-topics"
import { ENTRY_KINDS, ENTRY_STATUSES, type EntryKind, type EntryStatus, type LibraryEntry } from "@/lib/library-types"

// Client-safe filtering, sorting and grouping for the library index. The
// filter is a tiny command language typed into the `> filter:` prompt:
//
//   attention            free text, matched against title and author
//   topic:ai             a topic id, label or call-number code
//   status:reading       read | reading | queued
//   kind:paper           essay | paper | book | talk
//   <15m  >1h            reading time bounds (m or h)

export const SORTS = ["a-z", "date", "length", "topic"] as const
export type Sort = (typeof SORTS)[number]

export function isSort(value: unknown): value is Sort {
  return typeof value === "string" && SORTS.includes(value as Sort)
}

type Query = {
  text: string[]
  topic?: TopicId
  status?: EntryStatus
  kind?: EntryKind
  minMinutes?: number
  maxMinutes?: number
}

export function parseQuery(input: string): Query {
  const query: Query = { text: [] }

  for (const token of input.toLowerCase().split(/\s+/).filter(Boolean)) {
    const [key, value] = token.split(":", 2)
    const bound = token.match(/^([<>])(\d+(?:\.\d+)?)(m|min|h)?$/)

    if (key === "topic" && value) {
      query.topic = findTopic(value)
    } else if (key === "status" && ENTRY_STATUSES.includes(value as EntryStatus)) {
      query.status = value as EntryStatus
    } else if (key === "kind" && ENTRY_KINDS.includes(value as EntryKind)) {
      query.kind = value as EntryKind
    } else if (bound) {
      const minutes = Number(bound[2]) * (bound[3] === "h" ? 60 : 1)
      if (bound[1] === "<") query.maxMinutes = minutes
      else query.minMinutes = minutes
    } else {
      query.text.push(token)
    }
  }

  return query
}

function findTopic(value: string): TopicId | undefined {
  return (Object.keys(libraryTopics) as TopicId[]).find(
    (id) => id === value || libraryTopics[id].label.toLowerCase() === value || libraryTopics[id].code.toLowerCase() === value,
  )
}

export function filterEntries(entries: LibraryEntry[], input: string) {
  const query = parseQuery(input)

  return entries.filter((entry) => {
    if (query.topic && entry.topic !== query.topic) return false
    if (query.status && entry.status !== query.status) return false
    if (query.kind && entry.kind !== query.kind) return false
    if (query.maxMinutes !== undefined && entry.minutes >= query.maxMinutes) return false
    if (query.minMinutes !== undefined && entry.minutes <= query.minMinutes) return false
    const haystack = `${entry.title} ${entry.author} ${entry.callNumber}`.toLowerCase()
    return query.text.every((term) => haystack.includes(term))
  })
}

// Replaces (or removes, when `value` is undefined) a key:value token, keeping
// the rest of what the visitor typed.
export function setToken(input: string, key: string, value: string | undefined) {
  const rest = input
    .split(/\s+/)
    .filter((token) => token && !token.toLowerCase().startsWith(`${key}:`))
  return [...rest, ...(value ? [`${key}:${value}`] : [])].join(" ")
}

export type EntryGroup = {
  key: string
  label: string
  topic?: TopicId
  entries: LibraryEntry[]
}

// Book indexes ignore leading articles: "The Bitter Lesson" files under B.
export function sortTitle(title: string) {
  return title.replace(/^(the|a|an)\s+/i, "")
}

const LENGTH_BUCKETS = [
  { key: "short", label: "Under 10 min", max: 10 },
  { key: "medium", label: "10 – 30 min", max: 30 },
  { key: "long", label: "30 – 60 min", max: 60 },
  { key: "hours", label: "An hour or more", max: Infinity },
] as const

const MONTH = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })

export function groupEntries(entries: LibraryEntry[], sort: Sort): EntryGroup[] {
  const groups = new Map<string, EntryGroup>()
  const add = (key: string, label: string, entry: LibraryEntry, topic?: TopicId) => {
    const group = groups.get(key) ?? { key, label, topic, entries: [] }
    group.entries.push(entry)
    groups.set(key, group)
  }

  const byTitle = (a: LibraryEntry, b: LibraryEntry) => sortTitle(a.title).localeCompare(sortTitle(b.title))

  if (sort === "a-z") {
    for (const entry of [...entries].sort(byTitle)) {
      const letter = sortTitle(entry.title).charAt(0).toUpperCase()
      add(/[A-Z]/.test(letter) ? letter : "#", /[A-Z]/.test(letter) ? letter : "#", entry)
    }
  } else if (sort === "date") {
    // Newest activity first: when it was finished, else when it was added.
    const when = (entry: LibraryEntry) => entry.finished ?? entry.added
    for (const entry of [...entries].sort((a, b) => when(b).localeCompare(when(a)))) {
      add(when(entry).slice(0, 7), MONTH.format(new Date(when(entry))), entry)
    }
  } else if (sort === "length") {
    for (const entry of [...entries].sort((a, b) => a.minutes - b.minutes)) {
      const bucket = LENGTH_BUCKETS.find((b) => entry.minutes < b.max)!
      add(bucket.key, bucket.label, entry)
    }
  } else {
    for (const topic of Object.keys(libraryTopics) as TopicId[]) {
      for (const entry of entries.filter((e) => e.topic === topic).sort(byTitle)) {
        add(topic, libraryTopics[topic].label, entry, topic)
      }
    }
  }

  return [...groups.values()]
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.round((minutes / 60) * 2) / 2
  return `${hours} h`
}
