import { Suspense } from "react"

import { SentenceHome, SentenceLanding } from "@/components/explore/sentence-view"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { HomeFooter } from "@/components/sections/home-footer"
import { getLibrary } from "@/lib/library"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { jsonLdScript, personJsonLd } from "@/lib/seo"

export default function Home() {
  // The places the sentence opens read posts in full and the reading library,
  // so they can show them in place.
  const posts = getAllPosts().flatMap((meta) => getPostBySlug(meta.slug) ?? [])
  const library = getLibrary()

  return (
    <LayoutWrapper>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd)} />
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
  )
}
