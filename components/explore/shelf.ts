"use client"

import { useEffect, useMemo, useState } from "react"
import { flushSync } from "react-dom"
import { useSearchParams } from "next/navigation"

import { exploreContent, type SectionId } from "@/content/explore"
import { homeContent } from "@/content/home"
import { projectsContent, type Project } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import type { MarkName } from "@/components/dot-mark"
import { formatPostDate } from "@/lib/format-date"
import type { LibraryEntry } from "@/lib/library-types"
import type { Post } from "@/lib/posts"
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
}

export type ShelfSection = {
  id: SectionId
  title: string
  line: string
  tone: "sun" | "sky" | "mint" | "grape" | "coral"
  mark: MarkName
  items: ShelfItem[]
  /** Extra paragraphs (about me). */
  body?: string[]
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
        tone: "sun",
        mark: "face",
        body: [hero.intro, hero.description],
        items: [
          { id: "cv", title: t.cv, href: "/cv.pdf", external: true },
          { id: "things", title: t.things, href: localize("/things") },
        ],
      },
      posts: {
        id: "posts",
        ...t.sections.posts,
        tone: "sky",
        mark: "letter",
        items: posts.map((post) => ({
          id: post.slug,
          title: post.title,
          meta: post.date ? formatPostDate(post.date, language) : undefined,
          post,
        })),
      },
      projects: {
        id: "projects",
        ...t.sections.projects,
        tone: "mint",
        mark: "window",
        items: projects.map((project) => ({
          id: project.slug ?? project.title,
          title: project.title,
          meta: project.tech[0]?.toLowerCase(),
          image: project.preview.kind === "screens" ? project.preview.screens[0].src : undefined,
          project,
        })),
      },
      reading: {
        id: "reading",
        ...t.sections.reading,
        tone: "grape",
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
      },
      elsewhere: {
        id: "elsewhere",
        ...t.sections.elsewhere,
        tone: "coral",
        mark: "penguin",
        items: [
          { id: "github", title: "github", meta: "code", href: "https://github.com/dumbld0re", external: true },
          { id: "pinterest", title: "pinterest", meta: "pictures", href: PINTEREST_URL, external: true },
          { id: "x", title: "x", meta: "words", href: X_URL, external: true },
          { id: "instagram", title: "instagram", meta: "photos", href: INSTAGRAM_URL, external: true },
          { id: "aestudio", title: "æ design studio", meta: "client work", href: "https://www.aestudio.site/", external: true },
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
export function useExploreState() {
  const params = useSearchParams()
  const read = (q: URLSearchParams = new URLSearchParams(window.location.search)) => ({
    section: (q.get("s") as SectionId | null) ?? null,
    item: q.get("i"),
  })
  // The first render matches the server's (both read the request's params).
  const [state, setState] = useState(() => read(new URLSearchParams(params.toString())))

  useEffect(() => {
    const onPop = () => setState(read())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  // While a place is open the page is the reader alone: the footer and the
  // home page's loop (components/page-loop.tsx) step aside.
  useEffect(() => {
    const root = document.documentElement
    if (state.section) root.setAttribute("data-place-open", "")
    else root.removeAttribute("data-place-open")
    return () => root.removeAttribute("data-place-open")
  }, [state.section])

  const go = (next: { s?: SectionId | null; i?: string | null }) => {
    const deeper = Object.values(next).some(Boolean)
    soundEvent(deeper ? "enter" : "leave", 0.5, 0.5)
    const q = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(next)) {
      if (value) q.set(key, value)
      else q.delete(key)
    }
    window.history.pushState(null, "", `${window.location.pathname}${q.size ? `?${q}` : ""}`)
    const apply = () => flushSync(() => setState(read()))
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (document.startViewTransition && !still) document.startViewTransition(apply)
    else apply()
    // Opening a place starts at its top.
    if (next.s !== undefined) window.scrollTo({ top: 0 })
  }

  return {
    ...state,
    open: (s: SectionId) => go({ s, i: null }),
    openItem: (s: SectionId, i: string) => go({ s, i }),
    closeItem: () => go({ i: null }),
    close: () => go({ s: null, i: null }),
  }
}
