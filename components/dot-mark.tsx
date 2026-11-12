// Tiny marks drawn in dots, set before a name in running text so they belong
// to the dot name: each is a 7x7 grid, "#" a dot.
const MARKS = {
  // a penguin, for linux
  penguin: ["..###..", ".#####.", ".#.#.#.", "##...##", "##...##", ".#...#.", ".##.##."],
  // a mortarboard, for the university
  cap: ["...#...", ".#####.", "#######", ".#####.", "..###.#", "..#.#.#", "......#"],
  // a pin, for a place
  pin: ["..###..", ".#####.", "##...##", ".#####.", "..###..", "...#...", "...#..."],
  // an envelope, for writing
  letter: ["#######", "##...##", "#.#.#.#", "#..#..#", "#.....#", "#######", "......."],
  // a die, for things that change
  shuffle: ["#######", "#.....#", "#.#.#.#", "#.....#", "#.#.#.#", "#.....#", "#######"],
} as const

export type MarkName = keyof typeof MARKS

export function DotMark({ name }: { name: MarkName }) {
  const rows = MARKS[name]
  return (
    <svg viewBox="0 0 7 7" className="dot-mark" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === "#" ? <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.42} fill="currentColor" /> : null)),
      )}
    </svg>
  )
}
