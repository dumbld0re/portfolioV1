import type { Language } from "@/lib/i18n"

/** 90 → "1h 30m" (or "1 std 30 min"), whichever side of me it is. */
function span(minutes: number, hourUnit: string, minuteUnit: string) {
  const a = Math.abs(minutes)
  const h = Math.floor(a / 60)
  const m = a % 60
  return [h && `${h}${hourUnit}`, m && `${m}${minuteUnit}`].filter(Boolean).join(" ")
}

export const contactContent: Record<
  Language,
  {
    title: string
    heading: string
    blurbBefore: string
    email: string
    /** Between the email and the WhatsApp link. */
    blurbAfter: string
    /** After the WhatsApp link. */
    blurbEnd: string
    phone: string
    /** Names the letter dialog for screen readers. */
    writeLabel: string
    form: {
      greeting: string
      messageLabel: string
      messagePlaceholder: string
      emailLabel: string
      emailPlaceholder: string
      send: string
      sending: string
      sent: string
      sentNote: (email: string) => string
      again: string
      close: string
      needMessage: string
      needEmail: string
      badEmail: string
      failed: string
      failedLink: string
      /** Under the message box in the contact section: where the message goes. */
      privacy: string
    }
    time: {
      mine: string
      yours: string
      same: string
      /** The visitor's offset minus mine, in minutes (never 0). */
      gap: (minutes: number) => string
      /** Past 22:00 my time, before midnight. */
      lateEvening: string
      /** After midnight, before morning. */
      lateNight: string
    }
  }
> = {
  de: {
    title: "Kontakt",
    heading: "sag hallo.",
    blurbBefore: "Egal ob du eine Idee hast, eine Frage, oder einfach reden willst, schreib mir an",
    email: "dannymiiguel@gmail.com",
    blurbAfter: ". oder schreib mir direkt auf",
    blurbEnd: ".",
    phone: "+264 85 800 0433",
    writeLabel: "Schreib mir",
    form: {
      greeting: "Hallo Danny-Miguel",
      messageLabel: "Nachricht",
      messagePlaceholder: "Ich mag deine Arbeit. Lass uns zusammen etwas bauen.",
      emailLabel: "Deine E-Mail",
      emailPlaceholder: "du@beispiel.de",
      send: "Senden",
      sending: "Wird gesendet…",
      sent: "Angekommen.",
      sentNote: (email) => `Danke! Ich antworte dir an ${email}, meistens innerhalb eines Tages.`,
      again: "Noch eine schreiben",
      close: "Schließen",
      needMessage: "Schreib mir zuerst ein paar Worte.",
      needEmail: "Deine E-Mail, bitte, damit ich antworten kann.",
      badEmail: "Die E-Mail sieht nicht ganz richtig aus.",
      failed: "Das hat nicht geklappt.",
      failedLink: "Per Mail-App senden",
      privacy: "deine nachricht und e-mail gehen über web3forms in mein postfach. sonst wird nichts gespeichert.",
    },
    time: {
      mine: "meine zeit gerade",
      yours: "deine zeit gerade",
      same: "wir sind in derselben zeitzone",
      gap: (m) => `${span(m, " std", " min")} ${m > 0 ? "voraus" : "hinterher"}`,
      lateEvening: "hier ist es nach 22 uhr, ich antworte dir morgen",
      lateNight: "hier ist es mitten in der nacht, ich antworte dir morgen früh",
    },
  },
  en: {
    title: "Contact",
    heading: "say hi.",
    blurbBefore: "Whether you have an idea, a question, or just want to talk, write to me at",
    email: "dannymiiguel@gmail.com",
    blurbAfter: ". or shoot me a text directly at",
    blurbEnd: ".",
    phone: "+264 85 800 0433",
    writeLabel: "Write to me",
    form: {
      greeting: "Hello Danny-Miguel",
      messageLabel: "Message",
      messagePlaceholder: "Love your work. Let’s build something together.",
      emailLabel: "Your email",
      emailPlaceholder: "you@example.com",
      send: "Send",
      sending: "Sending…",
      sent: "Delivered.",
      sentNote: (email) => `Thanks! I’ll reply to ${email}, usually within a day.`,
      again: "Write another",
      close: "Close",
      needMessage: "Write me a few words first.",
      needEmail: "Your email, please, so I can reply.",
      badEmail: "That email doesn’t look quite right.",
      failed: "That didn’t go through.",
      failedLink: "Send it from your mail app",
      privacy: "your message and email go to my inbox through web3forms. nothing else is stored.",
    },
    time: {
      mine: "my time currently",
      yours: "your time currently",
      same: "we're in the same timezone",
      gap: (m) => `${span(m, "h", "m")} ${m > 0 ? "ahead" : "behind"}`,
      lateEvening: "it's past 10pm here, i'll reply tomorrow",
      lateNight: "it's the middle of the night here, i'll reply in the morning",
    },
  },
  it: {
    title: "Contatti",
    heading: "dimmi ciao.",
    blurbBefore: "Che tu abbia un'idea, una domanda o voglia solo fare due chiacchiere, scrivimi a",
    email: "dannymiiguel@gmail.com",
    blurbAfter: ". oppure scrivimi direttamente su",
    blurbEnd: ".",
    phone: "+264 85 800 0433",
    writeLabel: "Scrivimi",
    form: {
      greeting: "Ciao Danny-Miguel",
      messageLabel: "Messaggio",
      messagePlaceholder: "Mi piace il tuo lavoro. Costruiamo qualcosa insieme.",
      emailLabel: "La tua e-mail",
      emailPlaceholder: "tu@esempio.it",
      send: "Invia",
      sending: "Invio in corso…",
      sent: "Arrivato.",
      sentNote: (email) => `Grazie! Ti rispondo a ${email}, di solito entro un giorno.`,
      again: "Scrivine un altro",
      close: "Chiudi",
      needMessage: "Prima scrivimi qualche parola.",
      needEmail: "La tua e-mail, per favore, così posso risponderti.",
      badEmail: "Questa e-mail non sembra del tutto giusta.",
      failed: "Non è andato a buon fine.",
      failedLink: "Invialo dalla tua app di posta",
      privacy: "il tuo messaggio e la tua e-mail arrivano nella mia casella tramite web3forms. nient'altro viene salvato.",
    },
    time: {
      mine: "la mia ora adesso",
      yours: "la tua ora adesso",
      same: "siamo nello stesso fuso orario",
      gap: (m) => `${span(m, " h", " min")} ${m > 0 ? "avanti" : "indietro"}`,
      lateEvening: "qui sono passate le 22, ti rispondo domani",
      lateNight: "qui è notte fonda, ti rispondo domattina",
    },
  },
}
