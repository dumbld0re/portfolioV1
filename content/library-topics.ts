// Topics in the reading library. `code` prefixes each entry's call number
// (AI.003) and `color` picks one of the gruvbox chart tokens from globals.css,
// so topic colors follow the theme and drop out in boring mode.
export const libraryTopics = {
  ai: { label: "AI", code: "AI", color: "var(--chart-4)" },
  systems: { label: "Systems", code: "SY", color: "var(--chart-1)" },
  craft: { label: "Craft", code: "CR", color: "var(--chart-3)" },
  finance: { label: "Finance", code: "FI", color: "var(--chart-2)" },
  life: { label: "Life", code: "LI", color: "var(--chart-5)" },
} as const

export type TopicId = keyof typeof libraryTopics

export const libraryCopy = {
  ghost: "read",
  title: "The reading index",
  description:
    "Everything Danny-Miguel Mittelberger reads and keeps — essays, papers and books on software, AI, finance and the rest.",
}
