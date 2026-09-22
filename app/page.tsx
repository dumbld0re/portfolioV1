import { LayoutWrapper } from "@/components/layout-wrapper"
import { ContactSection } from "@/components/sections/contact-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { HomeSection } from "@/components/sections/home-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { jsonLdScript, personJsonLd } from "@/lib/seo"

export default function Home() {
  return (
    <LayoutWrapper>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd)} />
      <main className="flex-1">
        <HomeSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </LayoutWrapper>
  )
}
