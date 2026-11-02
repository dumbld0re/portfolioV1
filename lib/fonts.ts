import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import { GeistSerifTriangle } from "geist/font/serif/triangle"

// The type system: Geist Serif Triangle (a sharp, high-contrast display serif
// whose dots are little triangles) for headlines, Cabinet Grotesk (a variable
// grotesque) for body and UI, and Geist Mono for the terminal chrome — file
// paths, tags, the email. Shared by both root layouts (app/[lang] and app/library).
const cabinet = localFont({
  src: "../app/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet",
  weight: "100 900",
  display: "swap",
})
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const fontVariables = `${GeistSerifTriangle.variable} ${cabinet.variable} ${geistMono.variable}`
