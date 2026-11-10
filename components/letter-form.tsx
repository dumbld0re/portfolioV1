"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { track } from "@vercel/analytics"

import { contactContent } from "@/content/contact"
import { useLanguageOrDefault } from "@/components/language-provider"
import { lockScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"

// web3forms access key for the contact letter. It's public by design: a key
// can only ever deliver mail to the inbox it was created for. While it's
// empty, Send opens the visitor's mail app with the letter filled in instead.
export const FORM_KEY = "340df0a4-2cab-4cef-857a-17ec374c807e"

type State = "idle" | "sending" | "sent" | "error"
type Problem = { field: "message" | "email"; text: string } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OPEN_EVENT = "letter:open"
const DRAFT_KEY = "letter-draft"
const CLOSE_MS = 180

function readDraft(): { message: string; email: string } | null {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null")
    return draft && typeof draft.message === "string" && typeof draft.email === "string" ? draft : null
  } catch {
    return null
  }
}

function saveDraft(draft: { message: string; email: string } | null) {
  try {
    if (draft && (draft.message || draft.email)) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {}
}

/** Opens the letter from anywhere: the corner's "say hello", the email icon. */
export function openLetter() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

/* The letter lives in a modal <dialog>, closed until someone asks for it.
   Esc, the close button and a click outside the sheet put it away; a draft
   survives closing (and moving between pages), a sent letter starts fresh
   next time. While it's open the page behind holds still. */
export function LetterDialog() {
  const label = contactContent[useLanguageOrDefault()].writeLabel
  const ref = useRef<HTMLDialogElement>(null)
  const [round, setRound] = useState(0)
  const wasSent = useRef(false)

  useEffect(() => {
    const open = () => {
      const dialog = ref.current
      if (!dialog || dialog.open) return
      if (wasSent.current) {
        wasSent.current = false
        setRound((r) => r + 1)
      }
      delete dialog.dataset.closing
      dialog.showModal()
      lockScroll(true)
      // straight into the letter, not onto the close button
      dialog.querySelector("textarea")?.focus()
      // put the custom cursor back above the dialog (components/custom-cursor.tsx)
      window.dispatchEvent(new Event("cursor:raise"))
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => {
      window.removeEventListener(OPEN_EVENT, open)
      lockScroll(false)
    }
  }, [])

  // Sinks away first (globals.css), then really closes.
  const dismiss = () => {
    const dialog = ref.current
    if (!dialog?.open || dialog.dataset.closing) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return dialog.close()
    dialog.dataset.closing = ""
    window.setTimeout(() => dialog.close(), CLOSE_MS)
  }

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
      onCancel={(e) => {
        e.preventDefault()
        dismiss()
      }}
      onClose={(e) => {
        delete e.currentTarget.dataset.closing
        lockScroll(false)
      }}
      className="letter-dialog m-auto w-full max-w-xl overflow-visible bg-transparent p-4 text-foreground backdrop:bg-background/75 backdrop:backdrop-blur-sm"
    >
      <LetterForm
        key={round}
        onClose={dismiss}
        onSent={() => {
          wasSent.current = true
        }}
      />
    </dialog>
  )
}

/* A sheet of paper you write straight onto: a greeting, the message, your
   address at the foot of the page, and the Send pill tucked under its
   bottom edge. No boxes, no labels on show. */
export function LetterForm({
  id = "letter",
  className,
  onClose,
  onSent,
}: {
  /** Prefix for the fields' ids, so two letters can share a page. */
  id?: string
  className?: string
  onClose?: () => void
  onSent?: () => void
}) {
  const language = useLanguageOrDefault()
  const t = contactContent[language]
  const f = t.form

  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [state, setState] = useState<State>("idle")
  const [problem, setProblem] = useState<Problem>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // A draft left earlier in this tab comes back. Read after hydration: the
  // server can't see it.
  useEffect(() => {
    const draft = readDraft()
    if (!draft) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(draft.message)
    setEmail(draft.email)
  }, [])

  const mailto = `mailto:${t.email}?subject=${encodeURIComponent(f.greeting)}&body=${encodeURIComponent(message)}`

  const reject = (field: "message" | "email", text: string) => {
    setProblem({ field, text })
    ;(field === "message" ? messageRef : emailRef).current?.focus()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    sheet.current?.animate(
      [0, -8, 7, -5, 3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
      { duration: 380, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" },
    )
  }

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === "sending") return
    if (new FormData(e.currentTarget).get("botcheck")) return
    const msg = message.trim()
    const from = email.trim()
    if (!msg) return reject("message", f.needMessage)
    if (!from) return reject("email", f.needEmail)
    if (!EMAIL_RE.test(from)) return reject("email", f.badEmail)
    setProblem(null)

    if (!FORM_KEY) {
      window.location.href = mailto
      return
    }

    setState("sending")
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `dannymiguel.com — from ${from}`,
          from_name: "dannymiguel.com",
          email: from, // becomes the reply-to
          message: msg,
        }),
      })
      const data = await res.json().catch(() => ({}))
      const ok = res.ok && data.success !== false
      setState(ok ? "sent" : "error")
      if (ok) {
        saveDraft(null)
        track("letter sent")
        onSent?.()
      }
    } catch {
      setState("error")
    }
  }

  const again = () => {
    setMessage("")
    setState("idle")
    requestAnimationFrame(() => messageRef.current?.focus())
  }

  const sent = state === "sent"
  const busy = state === "sending"
  const field =
    "w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-60"
  const wrong = "decoration-destructive underline decoration-wavy underline-offset-4"

  return (
    <form
      onSubmit={send}
      // Ctrl/Cmd + Enter sends, as in a mail app.
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.requestSubmit()
      }}
      noValidate
      className={cn("flex w-full max-w-xl flex-col items-center", className)}
    >
      <div
        ref={sheet}
        className="relative flex min-h-[26rem] w-full flex-col rounded-[3px] border border-border/70 bg-card px-7 pt-8 pb-12 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.12)] md:min-h-[30rem] md:px-12 md:pt-12 md:pb-14 dark:shadow-none"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={f.close}
            title={f.close}
            className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary md:top-4 md:right-4"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
        {sent ? (
          <div role="status" className="flex flex-1 flex-col justify-center gap-3">
            <p className="text-xl font-medium text-foreground md:text-2xl">{f.sent}</p>
            <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">{f.sentNote(email.trim())}</p>
          </div>
        ) : (
          <>
            <p className="pr-10 text-xl font-medium text-foreground md:text-2xl" aria-hidden="true">
              {f.greeting}
            </p>
            <label htmlFor={`${id}-message`} className="sr-only">
              {f.messageLabel}
            </label>
            <textarea
              id={`${id}-message`}
              ref={messageRef}
              name="message"
              rows={6}
              value={message}
              disabled={busy}
              onChange={(e) => {
                setMessage(e.target.value)
                saveDraft({ message: e.target.value, email })
                if (problem?.field === "message") setProblem(null)
              }}
              placeholder={f.messagePlaceholder}
              aria-invalid={problem?.field === "message" || undefined}
              aria-describedby={problem?.field === "message" ? `${id}-problem` : undefined}
              className={cn(
                field,
                "mt-5 flex-1 resize-none text-lg leading-relaxed [field-sizing:content] md:text-xl",
              )}
            />
            <label htmlFor={`${id}-email`} className="sr-only">
              {f.emailLabel}
            </label>
            <input
              id={`${id}-email`}
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={email}
              disabled={busy}
              onChange={(e) => {
                setEmail(e.target.value)
                saveDraft({ message, email: e.target.value })
                if (problem?.field === "email") setProblem(null)
              }}
              placeholder={f.emailPlaceholder}
              aria-invalid={problem?.field === "email" || undefined}
              aria-describedby={problem?.field === "email" ? `${id}-problem` : undefined}
              className={cn(field, "mt-8 text-lg md:text-xl", problem?.field === "email" && wrong)}
            />
            {/* honeypot: people never see it, bots tick it */}
            <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" />
          </>
        )}
      </div>

      {/* the pill sits on the sheet's bottom edge, like a stamp on the fold */}
      <button
        type={sent ? "button" : "submit"}
        onClick={sent ? again : undefined}
        disabled={busy}
        className="relative z-10 -mt-7 inline-flex h-14 min-w-36 items-center justify-center rounded-[3px] bg-foreground px-9 text-base font-medium text-background shadow-[0_6px_20px_-8px_rgb(0_0_0/0.45)] transition-[transform,opacity] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-0 disabled:opacity-70 motion-reduce:transition-none"
      >
        {sent ? f.again : busy ? f.sending : f.send}
      </button>

      <p aria-live="polite" className="mt-4 min-h-6 text-center font-mono text-sm text-muted-foreground">
        {problem ? (
          <span id={`${id}-problem`} className="text-destructive">
            {problem.text}
          </span>
        ) : state === "error" ? (
          <>
            {f.failed}{" "}
            <a href={mailto} className="text-foreground underline underline-offset-4">
              {f.failedLink}
            </a>
          </>
        ) : null}
      </p>
    </form>
  )
}
