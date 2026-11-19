import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"

import { LANGUAGES, DEFAULT_LANGUAGE, type Language } from "@/lib/i18n"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

// A post is written in English as <slug>.md. A translation sits next to it as
// <slug>.de.md or <slug>.it.md with its own title, summary and text; the date
// and `pinned` always come from the English file. Without one, English shows.
const TRANSLATED = LANGUAGES.filter((l) => l !== DEFAULT_LANGUAGE)
const TRANSLATION_FILE = new RegExp(`\\.(${TRANSLATED.join("|")})\\.md$`)

type Text = { title: string; summary: string }

export type PostMeta = Text & {
  slug: string
  date: string
  /** `pinned: true` in the frontmatter keeps a post at the top of every list. */
  pinned: boolean
  translations: Partial<Record<Language, Text>>
}

export type Post = Omit<PostMeta, "translations"> & {
  html: string
  translations: Partial<Record<Language, Text & { html: string }>>
}

// A friend's name is written as [[redacted]] in the markdown, never the name
// itself (the repo is public). It renders as a fixed-width black bar marked
// (b)(6), like a released FOIA file, so the bar's length gives nothing away.
const REDACTED = /\[\[redacted\]\]/gi
const REDACTED_BAR = '<span class="redacted" role="img" aria-label="name redacted"></span>'

function render(markdown: string): string {
  return marked.parse(markdown.replace(REDACTED, REDACTED_BAR), { async: false })
}

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") && !TRANSLATION_FILE.test(file))
    .map((file) => file.replace(/\.md$/, ""))
}

function readFile(slug: string, language?: Language) {
  const filePath = path.join(POSTS_DIR, language ? `${slug}.${language}.md` : `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"))
  return { data, content }
}

function readTranslations<T>(slug: string, fallback: Text, shape: (text: Text, content: string) => T) {
  const translations: Partial<Record<Language, T>> = {}
  for (const language of TRANSLATED) {
    const file = readFile(slug, language)
    if (!file) continue
    const text = { title: file.data.title ?? fallback.title, summary: file.data.summary ?? fallback.summary }
    translations[language] = shape(text, file.content)
  }
  return translations
}

function readMeta(slug: string): PostMeta {
  const { data } = readFile(slug)!
  const text = { title: data.title ?? slug, summary: data.summary ?? "" }
  return {
    slug,
    ...text,
    date: data.date ?? "",
    pinned: data.pinned === true,
    translations: readTranslations(slug, text, (t) => t),
  }
}

export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map(readMeta)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const file = readFile(slug)
  if (!file) return null
  const { data, content } = file
  const text = { title: data.title ?? slug, summary: data.summary ?? "" }

  return {
    slug,
    ...text,
    date: data.date ?? "",
    pinned: data.pinned === true,
    html: render(content),
    translations: readTranslations(slug, text, (t, body) => ({ ...t, html: render(body) })),
  }
}
