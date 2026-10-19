// Hover "roll": the label slides up and an identical copy rolls in from
// below. Triggered by hovering the nearest link or button (see .roll-text in
// globals.css), so it can drop into any existing link without extra state.
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll-text">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
