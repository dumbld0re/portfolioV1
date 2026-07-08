import { LayoutWrapper } from "@/components/layout-wrapper"
import { ContactSection } from "@/components/sections/contact-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { HomeSection } from "@/components/sections/home-section"
import { ProjectsSection } from "@/components/sections/projects-section"

export default function Home() {
  return (
    <LayoutWrapper>
      <main className="flex-1">
        <HomeSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </LayoutWrapper>
  )
}
