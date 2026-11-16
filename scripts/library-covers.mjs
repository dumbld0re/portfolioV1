// Gives every library entry a real cover, saved to public/library/covers/<slug>.jpg:
//
//   a book    its cover, from Open Library (by title and author)
//   a paper   the first page of its PDF (needs pdftoppm, from poppler)
//   a page    the top of the page itself, as a reader first sees it
//             (needs Chromium; set CHROMIUM if it isn't on the PATH)
//
// `cover_from:` in an entry's frontmatter overrides where the cover comes
// from (a PDF or a page), for sources that are paywalled or blocked, and
// `cover_page:` picks a later page of a PDF (one that opens on a cover sheet).
// Entries with no cover get a drawn one on the page instead.
//
//   node scripts/library-covers.mjs          only the missing ones
//   node scripts/library-covers.mjs --force  all of them again
//   node scripts/library-covers.mjs <slug>   just that one (always refetched)

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import matter from "gray-matter"

const ROOT = process.cwd()
const DIR = path.join(ROOT, "content/library")
const OUT = path.join(ROOT, "public/library/covers")
const args = process.argv.slice(2)
const force = args.includes("--force")
const only = args.filter((a) => !a.startsWith("--"))
const UA = { "User-Agent": "Mozilla/5.0 (library cover fetcher)" }
const CHROMIUM = process.env.CHROMIUM ?? "chromium"
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "covers-"))

fs.mkdirSync(OUT, { recursive: true })
const target = (slug) => path.join(OUT, `${slug}.jpg`)

/** Any image to a JPEG, no wider than 800px, with its metadata stripped. */
function toJpeg(from, slug, crop) {
  const steps = crop ? ["-gravity", "north", "-crop", crop, "+repage"] : []
  execFileSync("magick", [from, ...steps, "-strip", "-resize", "800x>", "-quality", "82", target(slug)])
}

async function book(slug, title, author) {
  const q = new URLSearchParams({ title, author: author.split(/\s*&\s*|,/)[0], limit: "5", fields: "cover_i" })
  const res = await fetch(`https://openlibrary.org/search.json?${q}`, { headers: UA })
  const id = res.ok ? (await res.json()).docs?.find((d) => d.cover_i)?.cover_i : null
  if (!id) return false
  const img = await fetch(`https://covers.openlibrary.org/b/id/${id}-L.jpg`, { headers: UA })
  const buf = Buffer.from(await img.arrayBuffer())
  if (!img.ok || buf.length < 2000) return false
  const file = path.join(TMP, `${slug}-book.jpg`)
  fs.writeFileSync(file, buf)
  toJpeg(file, slug)
  return true
}

async function pdf(slug, url, n = 1) {
  const res = await fetch(url, { headers: UA, redirect: "follow" })
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("pdf")) return false
  const file = path.join(TMP, `${slug}.pdf`)
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  execFileSync("pdftoppm", ["-f", String(n), "-l", String(n), "-png", "-r", "110", "-singlefile", file, path.join(TMP, slug)])
  toJpeg(path.join(TMP, `${slug}.png`), slug)
  return true
}

function page(slug, url) {
  const shot = path.join(TMP, `${slug}-page.png`)
  execFileSync(CHROMIUM, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1.5",
    "--window-size=640,960",
    "--virtual-time-budget=6000",
    `--screenshot=${shot}`,
    url,
  ], { stdio: "ignore", timeout: 120_000 })
  if (!fs.existsSync(shot)) return false
  toJpeg(shot, slug, "960x1440+0+0")
  return true
}

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "")
  if (only.length ? !only.includes(slug) : !force && fs.existsSync(target(slug))) continue
  const { data } = matter(fs.readFileSync(path.join(DIR, file), "utf8"))
  let from = data.cover_from ?? data.url
  // An arXiv abstract page has its paper one step away.
  from = from.replace(/arxiv\.org\/abs\//, "arxiv.org/pdf/")
  let how = "none, a drawn cover"
  try {
    if (data.kind === "book" && (await book(slug, data.title, data.author))) how = "open library"
    else if ((/\.pdf($|\?)/.test(from) || from.includes("arxiv.org/pdf/")) && (await pdf(slug, from, data.cover_page ?? 1))) how = `first page of ${from}`
    else if (page(slug, from)) how = `page ${from}`
  } catch (e) {
    how = `failed (${e.message.split("\n")[0]})`
  }
  console.log(`${slug}: ${how}`)
}
fs.rmSync(TMP, { recursive: true, force: true })
