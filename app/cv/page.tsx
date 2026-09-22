import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { CvSection } from "@/components/sections/cv-section"
import { baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV of Danny-Miguel Mittelberger — web developer and quantitative finance student at the University of Namibia, based in Windhoek.",
  alternates: { canonical: "/cv" },
  openGraph: { ...baseOpenGraph, url: "/cv" },
}

export default function CvPage() {
  return (
    <LayoutWrapper>
      <CvSection />
    </LayoutWrapper>
  )
}
