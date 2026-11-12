// A section heading in the hero tagline's voice: "where i have [worked]",
// mono at the tagline's size with one word on the tagline's sun pill.
export function TaglineHeading({ text, pill, className }: { text: string; pill?: string; className?: string }) {
  const line = text.replace(/\.$/, "")
  const at = pill ? line.lastIndexOf(pill) : -1
  return (
    <p className={className}>
      {at < 0 ? (
        line
      ) : (
        <>
          {line.slice(0, at)}
          <span className="pill cursor-default" data-tone="sun">
            {pill}
          </span>
          {line.slice(at + pill!.length)}
        </>
      )}
    </p>
  )
}
