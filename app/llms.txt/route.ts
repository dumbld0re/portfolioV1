import { contactContent } from "@/content/contact"
import { homeContent } from "@/content/home"
import { hasCase, projectPath, projectsContent } from "@/content/projects"
import { getAllPosts } from "@/lib/posts"
import { PROFILES, SITE_NAME, SITE_URL } from "@/lib/seo"

// /llms.txt (llmstxt.org): who I am, my work and how to reach me, as plain
// text for agents. Built from the same content files as the site, in English.
export const dynamic = "force-static"

export function GET() {
  const hero = homeContent.en.hero
  const work = projectsContent.en
  const contact = contactContent.en
  const url = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`)

  const project = (p: (typeof work.projects)[number]) => {
    const href = hasCase(p) ? url(projectPath(p.slug)) : p.demoHref ? url(p.demoHref) : `${SITE_URL}/projects`
    return `- [${p.title}](${href})${p.short ? `: ${p.short}` : ""}`
  }

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${hero.intro} ${hero.description}`,
    "",
    `## ${work.heading}`,
    "",
    ...work.projects.filter((p) => !p.group).map(project),
    "",
    "## Internal tools",
    "",
    ...work.projects.filter((p) => p.group === "tools").map(project),
    "",
    "## Random cool things",
    "",
    ...work.projects.filter((p) => p.group === "fun").map(project),
    "",
    "## Posts",
    "",
    ...getAllPosts().map((post) => `- [${post.title}](${SITE_URL}/posts/${post.slug}): ${post.summary}`),
    "",
    "## Contact",
    "",
    `- Email: ${contact.email}`,
    `- WhatsApp: ${contact.phone} (https://wa.me/${contact.phone.replace(/[^\d]/g, "")})`,
    `- CV: ${SITE_URL}/cv.pdf`,
    "",
    "## Elsewhere",
    "",
    ...PROFILES.map(([label, href]) => `- ${label}: ${href}`),
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
