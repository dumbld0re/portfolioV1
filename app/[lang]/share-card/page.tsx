import { notFound } from "next/navigation"

import { ParticleText } from "@/components/particle-text"

// The share card's stage, for ~/Videos/portfolio-video/source/video/capture/
// share-card.mjs to screenshot (the still card) and record (the video). Dev
// only: it never ships.
//   ?icon=0  leaves the icon out (the video, where the cursor plays its part)
export default async function ShareCard({ searchParams }: { searchParams: Promise<{ icon?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound()
  const { icon } = await searchParams

  return (
    <div data-share-card="" className="fixed inset-0 z-[200] bg-background">
      <section data-stage="" className="relative flex h-full flex-col items-center justify-center">
        {/* The name alone is centred (nudged so its letters, not its line box, sit
            on the middle); the icon hangs below it. */}
        <div className="relative -top-[0.55vw] -left-[0.2vw]">
          <ParticleText
            lines={["danny-miguel", "mittelberger"]}
            accent="-"
            className="font-serif font-normal lowercase tracking-[-0.02em] text-center text-[11vw] leading-[0.98]"
          />
          {icon !== "0" && (
          // The site's mark: the cursor triangle on a black tile (public/icon.svg).
          <svg data-share-icon="" viewBox="0 0 100 100" className="absolute left-[calc(50%+0.2vw)] top-full mt-[4.2vw] size-[5vw] -translate-x-1/2" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#000" />
            <g transform="translate(31.8 19.84) scale(2.6)">
              <path d="M1.5 1.5 L16.78 15.34 L7.42 14.19 L2.28 22.1 Z" fill="#fff" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
            </g>
          </svg>
          )}
        </div>
      </section>
    </div>
  )
}
