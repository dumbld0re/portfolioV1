import { Suspense } from "react"

import { SentenceCounts, SentenceHome, SentenceLanding } from "@/components/explore/sentence-view"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { HomeFooter } from "@/components/sections/home-footer"
import { homeContent } from "@/content/home"
import { projectPath, projectsContent } from "@/content/projects"
import { BOOKSHELF_LIVE } from "@/lib/features"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { getLibrary } from "@/lib/library"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { SITE_NAME, jsonLdScript, personJsonLd } from "@/lib/seo"

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE

  // The places the sentence opens read posts in full and the reading library,
  // so they can show them in place.
  const posts = getAllPosts().flatMap((meta) => getPostBySlug(meta.slug) ?? [])
  const library = BOOKSHELF_LIVE ? getLibrary() : []

  return (
    <SentenceCounts
      counts={{
        posts: posts.length,
        ...(BOOKSHELF_LIVE ? { reading: library.length } : {}),
      }}
    >
      <LayoutWrapper>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd)} />
        <AgentSummary language={language} />
        <main className="flex-1">
          {/* Which place is open lives in the URL, read on the client. */}
          <Suspense
            fallback={
              <>
                <SentenceLanding />
                <HomeFooter />
              </>
            }
          >
            <SentenceHome data={{ posts, library }} />
          </Suspense>
        </main>
      </LayoutWrapper>
    </SentenceCounts>
  )
}

/**
 * Who I am and the main work, in plain server HTML, for readers that don't run
 * JavaScript (agents, text browsers). The sentence above says the same things
 * but only opens them on the client. Visually hidden (sr-only, not
 * aria-hidden), so the page looks exactly as before. Every word comes from
 * content/home.ts and content/projects.ts.
 */
function AgentSummary({ language }: { language: keyof typeof homeContent }) {
  const hero = homeContent[language].hero
  const work = projectsContent[language]
  const main = work.projects.filter((project) => !project.group)

  return (
    <section className="sr-only">
      <h1>{SITE_NAME}</h1>
      <p>{hero.intro}</p>
      <h2>{work.heading}</h2>
      <ul>
        {main.map((project) => (
          <li key={project.title}>
            <a href={project.slug && !project.demoOnly ? localizePath(language, projectPath(project.slug)) : project.demoHref}>
              {project.title}
            </a>
            {project.short ? `: ${project.short}` : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
