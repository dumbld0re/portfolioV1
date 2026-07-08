import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

export type PostMeta = {
  slug: string
  title: string
  date: string
  summary: string
}

export type Post = PostMeta & {
  html: string
}

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
}

function readMeta(slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf-8")
  const { data } = matter(raw)
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    summary: data.summary ?? "",
  }
}

export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map(readMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    summary: data.summary ?? "",
    html: marked.parse(content, { async: false }),
  }
}
