"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useSearchParams } from "next/navigation"

import { exploreContent, type SectionId } from "@/content/explore"
import { homeContent } from "@/content/home"
import { postsContent } from "@/content/posts"
import { projectsContent, type Project } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import type { MarkName } from "@/components/dot-mark"
import { formatPostDate } from "@/lib/format-date"
import { inLanguage } from "@/lib/post-language"
import type { LibraryEntry } from "@/lib/library-types"
import type { Post } from "@/lib/posts"
import { BOOKSHELF_LIVE } from "@/lib/features"
import { soundEvent } from "@/lib/sound"
import { INSTAGRAM_URL, PINTEREST_URL, X_URL } from "@/lib/styles"

// What the home page opens into: the same five places, each a title, one line
// and a list. Posts and the library are read on the server (app/[lang]/page.tsx)
// and handed down; the rest comes from content/.

export type ExploreData = { posts: Post[]; library: LibraryEntry[] }

export type ShelfItem = {
  id: string
  title: string
  /** Small mono note beside the title: a date, a year, a kind. */
  meta?: string
  /** Set for items that are only a link: they go there instead of opening. */
  href?: string
  external?: boolean
  /** A picture for the cards (pile) and the item column. */
  image?: string
  post?: Post
  project?: Project
  book?: LibraryEntry
  /** Set for items listed under a second heading below the rest. */
  group?: string
}

export type ShelfSection = {
  id: SectionId
  title: string
  /** One line under the title; a place can go without. */
  line?: string
  /** Its colour in the sentence (app/globals.css, "The sentence's palette"). */
  tone: "amber" | "orange" | "red" | "purple" | "blue"
  mark: MarkName
  items: ShelfItem[]
  more?: { label: string; href: string }
}

export const SECTION_ORDER: SectionId[] = ["about", "posts", "projects", "reading", "elsewhere"]

export function useShelf({ posts, library }: ExploreData): ShelfSection[] {
  const { language, localize } = useLanguage()

  return useMemo(() => {
    const t = exploreContent[language]
    const hero = homeContent[language].hero
    const projects = projectsContent[language].projects

    const sections: Record<SectionId, ShelfSection> = {
      about: {
        id: "about",
        ...t.sections.about,
        tone: "red",
        mark: "face",
        items: [
          { id: "cv", title: t.cv, href: "/cv.pdf", external: true },
          { id: "things", title: t.things, href: localize("/things") },
        ],
      },
      posts: {
        id: "posts",
        ...t.sections.posts,
        tone: "red",
        mark: "page",
        items: posts.map((source) => inLanguage(source, language)).map((post) => ({
          id: post.slug,
          title: post.title,
          meta: post.pinned
            ? postsContent[language].pinned
            : post.date
              ? formatPostDate(post.date, language)
              : undefined,
          post,
        })),
      },
      projects: {
        id: "projects",
        ...t.sections.projects,
        tone: "red",
        mark: "window",
        items: projects.map((project) => ({
          id: project.slug ?? project.title,
          title: project.title,
          meta: project.tech[0]?.toLowerCase(),
          image: project.preview.kind === "screens" ? project.preview.screens[0].src : undefined,
          project,
          group: project.group === "tools" ? t.tools : undefined,
        })),
      },
      reading: BOOKSHELF_LIVE
        ? {
            id: "reading",
            ...t.sections.reading,
            tone: "purple",
            mark: "cap",
            more: { label: t.fullLibrary, href: "/read" },
            items: [...library]
              .sort((a, b) => (a.added < b.added ? 1 : -1))
              .map((book) => ({
                id: book.slug,
                title: book.title,
                meta: book.author.toLowerCase(),
                image: book.cover ?? undefined,
                book,
              })),
          }
        : // Still being built: the place opens on one line and nothing else.
          { id: "reading", title: t.sections.reading.title, line: t.bookshelfSoon, tone: "purple", mark: "cap", items: [] },
      elsewhere: {
        id: "elsewhere",
        ...t.sections.elsewhere,
        tone: "blue",
        mark: "penguin",
        items: [
          { id: "github", title: "github", href: "https://github.com/dumbld0re", external: true },
          { id: "pinterest", title: "pinterest", href: PINTEREST_URL, external: true },
          { id: "x", title: "x", href: X_URL, external: true },
          { id: "instagram", title: "instagram", href: INSTAGRAM_URL, external: true },
          { id: "aestudio", title: "æ design studio", href: "https://www.aestudio.site/", external: true },
        ],
      },
    }
    return SECTION_ORDER.map((id) => sections[id])
  }, [language, localize, posts, library])
}

/**
 * Which place and item are open, kept in the URL (?s=posts&i=hello-garden) so
 * a link to an open post works and the back button steps out again. Changes
 * run inside a view transition where the browser has them, so a prototype can
 * name the parts that should travel (the sentence, a pill) and they morph.
 */
/** Counts glides, so one cut short by the next doesn't end the next's pause. */
let glides = 0

const depthOf = (s: { section: SectionId | null; item: string | null }) => (s.item ? 2 : s.section ? 1 : 0)

export function useExploreState() {
  const params = useSearchParams()
  const read = (q: URLSearchParams = new URLSearchParams(window.location.search)) => ({
    section: (q.get("s") as SectionId | null) ?? null,
    item: q.get("i"),
  })
  // The first render matches the server's (both read the request's params).
  const [state, setState] = useState(() => read(new URLSearchParams(params.toString())))

  // Moving between places runs a view transition, so the pills fly to
  // their new spots. Opening or closing an item inside one doesn't: the
  // item's column slides in by itself, and on phones the sentence isn't
  // there to fly anywhere.
  const show = (next: ReturnType<typeof read>, from: ReturnType<typeof read>) => {
    const apply = () => flushSync(() => setState(next))
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (next.section !== from.section && document.startViewTransition && !still) {
      // A second change that comes in mid-glide (two quick Escapes) skips
      // the first one's animation; that's fine, so its promises may reject quietly.
      // The columns' own width transitions sit out the glide: the new layout
      // lands at its end state at once, so the glide measures where things
      // really end up instead of a row still resizing under it.
      // From one open place to another the columns move as whole pieces
      // (the row re-centres when an item column closes): otherwise only the
      // pills would glide and the plain words between them would jump.
      // Set before the transition starts, so the old snapshot has the names too.
      const root = document.documentElement
      const glide = ++glides
      root.setAttribute("data-explore-glide", from.section && next.section ? "across" : "")
      const t = document.startViewTransition(apply)
      t.ready.catch(() => {})
      t.updateCallbackDone.catch(() => {})
      // Only the latest glide hands the transitions back.
      t.finished.catch(() => {}).finally(() => glide === glides && root.removeAttribute("data-explore-glide"))
    } else apply()
    // Deeper (or across to another place) steps up; back out steps down.
    const d = depthOf(next) - depthOf(from)
    if (d !== 0 || next.section !== from.section) soundEvent(d < 0 ? "leave" : "enter", 0.5, 0.5)
  }
  const current = useRef(state)
  useEffect(() => {
    current.current = state
  })

  // The back and forward buttons land here, with the same glide.
  useEffect(() => {
    const onPop = () => show(read(), current.current)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // While a place is open the page is the reader alone: the footer and the
  // home page's loop (components/page-loop.tsx) step aside.
  useEffect(() => {
    const root = document.documentElement
    if (state.section) root.setAttribute("data-place-open", "")
    else root.removeAttribute("data-place-open")
    return () => root.removeAttribute("data-place-open")
  }, [state.section])

  /** How many steps in from the first screen this history entry is (0 when
   *  the page was opened here directly). */
  const steps = () => (window.history.state?.exploreSteps as number | undefined) ?? 0

  const urlFor = (next: { s?: SectionId | null; i?: string | null }) => {
    const q = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(next)) {
      if (value) q.set(key, value)
      else q.delete(key)
    }
    return `${window.location.pathname}${q.size ? `?${q}` : ""}`
  }

  // Going in adds a history entry; coming out walks back over the ones we
  // added, so back, Escape and the "← back" buttons all agree.
  const goIn = (next: { s: SectionId; i?: string | null }) => {
    const from = current.current
    window.history.pushState({ ...window.history.state, exploreSteps: steps() + 1 }, "", urlFor(next))
    show(read(), from)
    if (next.s !== from.section) window.scrollTo({ top: 0 })
  }
  const goOut = (to: { s?: SectionId | null; i?: string | null }, back: number) => {
    const from = current.current
    if (back > 0 && steps() >= back) {
      window.history.go(-back)
      return
    }
    // Opened here directly: nothing of ours to go back over.
    window.history.pushState({ ...window.history.state, exploreSteps: 0 }, "", urlFor(to))
    show(read(), from)
  }

  return {
    ...state,
    open: (s: SectionId) => goIn({ s, i: null }),
    openItem: (s: SectionId, i: string) => goIn({ s, i }),
    // An item opened from its place is one step back; opened directly, it
    // falls back to the place's own URL.
    closeItem: () => goOut({ i: null }, current.current.item ? 1 : 0),
    // Back to the first screen: over every step taken since it.
    close: () => goOut({ s: null, i: null }, steps()),
  }
}
