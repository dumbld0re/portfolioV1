"use client"

import { useRef, useState, type FormEvent } from "react"
import { ArrowRight } from "lucide-react"
import { track } from "@vercel/analytics"

import { useLanguage } from "@/components/language-provider"
import { FORM_KEY } from "@/components/letter-form"
import { contactContent } from "@/content/contact"
import { cn } from "@/lib/utils"

type State = "idle" | "sending" | "sent" | "error"
type Problem = { field: "message" | "email"; text: string } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const label = "font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
const input =
  "w-full resize-none border-0 bg-transparent p-0 text-base leading-normal text-foreground outline-none placeholder:text-muted-foreground/70"
const field = "dot-rule flex flex-col gap-2 pb-3.5 pt-4 first:pt-0"

// A message box that sits in the contact section, beside the text: two
// fields on dotted lines and a send button. It delivers through the same
// web3forms key as the letter (components/letter-form.tsx).
export function ContactBox({ className }: { className?: string }) {
  const { language } = useLanguage()
  const t = contactContent[language]
  const f = t.form
  const [state, setState] = useState<State>("idle")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [problem, setProblem] = useState<Problem>(null)
  const form = useRef<HTMLFormElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const mailto = `mailto:${t.email}?subject=${encodeURIComponent(f.greeting)}&body=${encodeURIComponent(message)}`

  const reject = (where: "message" | "email", text: string) => {
    setProblem({ field: where, text })
    ;(where === "message" ? messageRef : emailRef).current?.focus()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    form.current?.animate(
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
        track("letter sent")
        // the dots in the background answer
        window.dispatchEvent(new Event("dots:pulse"))
      }
    } catch {
      setState("error")
    }
  }

  return (
    <form
      ref={form}
      onSubmit={send}
      noValidate
      className={cn("relative rounded-[20px] border border-border bg-card p-5 md:p-8", className)}
    >
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <div inert={state === "sent"}>
        <div className={field}>
          <label htmlFor="box-message" className={label}>
            {f.messageLabel}
          </label>
          <textarea
            id="box-message"
            ref={messageRef}
            rows={4}
            value={message}
            placeholder={f.messagePlaceholder}
            aria-invalid={problem?.field === "message"}
            onChange={(e) => {
              setMessage(e.target.value)
              if (problem) setProblem(null)
            }}
            className={input}
            data-lenis-prevent
          />
          {problem?.field === "message" && (
            <p role="alert" className="text-sm text-primary">
              {problem.text}
            </p>
          )}
        </div>
        <div className={field}>
          <label htmlFor="box-email" className={label}>
            {f.emailLabel}
          </label>
          <input
            id="box-email"
            ref={emailRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            placeholder={f.emailPlaceholder}
            aria-invalid={problem?.field === "email"}
            onChange={(e) => {
              setEmail(e.target.value)
              if (problem) setProblem(null)
            }}
            className={input}
          />
          {problem?.field === "email" && (
            <p role="alert" className="text-sm text-primary">
              {problem.text}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <button
            type="submit"
            disabled={state === "sending"}
            className="group inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {state === "sending" ? f.sending : f.send}
            {state !== "sending" && (
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            )}
          </button>
          <p className="text-xs leading-relaxed text-muted-foreground">{f.privacy}</p>
        </div>
        {state === "error" && (
          <p role="alert" className="mt-4 text-sm text-primary">
            {f.failed}{" "}
            <a href={mailto} className="text-foreground underline underline-offset-4">
              {f.failedLink}
            </a>
          </p>
        )}
      </div>

      {state === "sent" && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-card p-8 text-center motion-safe:animate-page-fade"
        >
          <p className="font-serif text-4xl lowercase">{f.sent}</p>
          <p className="max-w-[18rem] text-[15px] leading-relaxed text-muted-foreground">{f.sentNote(email.trim())}</p>
          <button
            type="button"
            onClick={() => {
              setMessage("")
              setState("idle")
            }}
            className="mt-3 cursor-pointer text-sm underline decoration-border underline-offset-[5px] transition-colors hover:decoration-primary"
          >
            {f.again}
          </button>
        </div>
      )}
    </form>
  )
}
