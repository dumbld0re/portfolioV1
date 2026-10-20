import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"

// The type system: Gambarino (an expressive display serif) for headlines,
// Cabinet Grotesk (a variable grotesque) for body and UI, and Geist Mono for
// the terminal chrome — file paths, tags, the email. Shared by both root
// layouts (app/[lang] and app/library).
const gambarino = localFont({
  src: "../app/fonts/Gambarino-Regular.woff2",
  variable: "--font-gambarino",
  weight: "400",
  // Headlines wait for the real face instead of flashing a fallback serif
  // and snapping to Gambarino; the hero name is too big for that to pass unseen.
  display: "block",
})
const cabinet = localFont({
  src: "../app/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet",
  weight: "100 900",
  display: "swap",
})
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const fontVariables = `${gambarino.variable} ${cabinet.variable} ${geistMono.variable}`
