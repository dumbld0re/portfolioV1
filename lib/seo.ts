export const SITE_URL = "https://www.dannymiguel.com"
export const SITE_NAME = "Danny-Miguel Mittelberger"

// schema.org Person for the home page — helps search engines tie the site,
// the name and the linked profiles together.
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  alternateName: "danny-miguel",
  url: SITE_URL,
  jobTitle: "Web Developer",
  description:
    "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windhoek",
    addressCountry: "NA",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Namibia",
  },
  knowsAbout: ["Web development", "Next.js", "React", "TypeScript", "Linux", "Quantitative finance"],
  sameAs: ["https://github.com/dumbld0re"],
}

// Escapes "<" so post titles or summaries can never close the script tag.
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
}

// Next merges metadata shallowly, so a page that sets its own openGraph drops
// the root's share image and site name. Pages spread this base to keep them.
export const baseOpenGraph = {
  siteName: SITE_NAME,
  locale: "en_US",
  images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
}
