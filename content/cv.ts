import type { Language } from "@/lib/i18n"

type CvEntry = {
  title: string
  org: string
  orgHref?: string
  period: string
  bullets: string[]
}

type CvData = {
  label: string
  name: string
  phone: string
  email: string
  website: string
  profileTitle: string
  profile: string
  educationTitle: string
  education: { title: string; detail: string; place: string; period: string }[]
  experienceTitle: string
  experience: CvEntry[]
  skillsTitle: string
  skills: { name: string; items: string }[]
  exportLabel: string
  downloadLabel: string
}

export const cvContent: Record<Language, CvData> = {
  de: {
    label: "Lebenslauf",
    name: "Danny-Miguel Mittelberger",
    phone: "+264 81 821 0003",
    email: "dannymiiguel@gmail.com",
    website: "dannymiguel.com",
    profileTitle: "Profil",
    profile:
      "Student der Quantitative Finance mit Erfahrung im Deutschunterricht, in der Robotik-Ausbildung und in der Verwaltung. Ich erkläre komplexe Sachverhalte verständlich, stelle mich auf unterschiedliche Lernstile ein und arbeite gern mit ganz unterschiedlichen Gruppen. Analytisch, gut organisiert und kommunikationsstark – mit einer strukturierten, zuverlässigen Arbeitsweise.",
    educationTitle: "Ausbildung & Zertifikate",
    education: [
      {
        title: "University of Namibia (UNAM)",
        detail: "Bachelor of Science in Quantitative Finance",
        place: "Windhoek, NA",
        period: "Laufend",
      },
      {
        title: "Eran Academy",
        detail: "Cambridge International AS and A Level",
        place: "Windhoek, NA",
        period: "2025",
      },
      {
        title: "Deutsches Sprachdiplom der Kultusministerkonferenz – Stufe I (DSD I)",
        detail: "Deutsches Sprachzertifikat (B2)",
        place: "Windhoek, NA",
        period: "2024",
      },
      {
        title: "Delta Secondary School Windhoek",
        detail: "NSSCO",
        place: "Windhoek, NA",
        period: "Jan 2021 – Nov 2024",
      },
    ],
    experienceTitle: "Erfahrung",
    experience: [
      {
        title: "Deutschlehrer (A1–B1)",
        org: "Fluent Academy",
        orgHref: "https://fluentacademy.co/#",
        period: "Dez 2025 – Heute",
        bullets: [
          "Deutschunterricht für Lernende von A1 bis B1, strukturiert im Einzel- und Kleingruppenunterricht.",
          "Unterrichtsplanung, verständliche Erklärung von Grammatik und Anpassung der Methoden an unterschiedliche Lernstile.",
          "Förderung von Sprechen, Hören, Lesen und Schreiben sowie Begleitung des Lernfortschritts.",
        ],
      },
      {
        title: "Praktikant Robotik",
        org: "MindsInAction",
        orgHref: "https://mindsinaction.com.na/",
        period: "Mai 2025 – Aug 2025",
        bullets: [
          "Coaching und Mentoring von Lernenden in Robotik und Programmiergrundlagen, abgestimmt auf das jeweilige Lernniveau.",
          "Anleitung von Schülerinnen und Schülern mit LEGO Mindstorms und NAO-Robotern – im strukturierten Unterricht und in der Einzelbetreuung.",
          "Unterstützung bei Workshops und verständliche Vermittlung technischer Inhalte.",
        ],
      },
      {
        title: "Assistent Verwaltung & Buchhaltung",
        org: "PyroNam",
        period: "Jun 2024 – Dez 2024",
        bullets: [
          "Kommunikation mit Mitarbeitenden und Kundschaft, um Informationen einzuholen und Unterlagen zu erläutern.",
          "Sorgfältige, detailgenaue Arbeit bei strukturierten Aufgaben und in der Datenpflege.",
        ],
      },
    ],
    skillsTitle: "Kenntnisse",
    skills: [
      { name: "Sprachen", items: "Englisch (fließend), Deutsch (B2), Afrikaans (Konversation)" },
      {
        name: "Vermittlung",
        items: "Coaching, Mentoring, Unterrichtsplanung, Grammatikvermittlung, Erklärkompetenz, Gruppenkommunikation, strukturierte Anleitung",
      },
      { name: "Technik", items: "Java, Python, HTML/CSS, Git, Docker, VS Code, Linux, Sage Pastel" },
      { name: "Office", items: "Microsoft Excel, Word, PowerPoint, Outlook" },
    ],
    exportLabel: "Als PDF exportieren",
    downloadLabel: "PDF herunterladen",
  },
  en: {
    label: "Curriculum Vitae",
    name: "Danny-Miguel Mittelberger",
    phone: "+264 81 821 0003",
    email: "dannymiiguel@gmail.com",
    website: "dannymiguel.com",
    profileTitle: "Profile",
    profile:
      "Quantitative Finance student with experience in German language tutoring, robotics education, and administrative support. Skilled in explaining complex concepts clearly, adapting to different learning styles, and working with diverse groups. Strong analytical, organisational, and communication skills with a structured and reliable approach to problem-solving.",
    educationTitle: "Education & Certification",
    education: [
      {
        title: "University of Namibia (UNAM)",
        detail: "Bachelor of Science in Quantitative Finance",
        place: "Windhoek, NA",
        period: "Present",
      },
      {
        title: "Eran Academy",
        detail: "Cambridge International AS and A Level",
        place: "Windhoek, NA",
        period: "2025",
      },
      {
        title: "Deutsches Sprachdiplom der Kultusministerkonferenz – Stufe I (DSD I)",
        detail: "German Language Certification (B2)",
        place: "Windhoek, NA",
        period: "2024",
      },
      {
        title: "Delta Secondary School Windhoek",
        detail: "NSSCO",
        place: "Windhoek, NA",
        period: "Jan 2021 – Nov 2024",
      },
    ],
    experienceTitle: "Experience",
    experience: [
      {
        title: "German Tutor (A1–B1)",
        org: "Fluent Academy",
        orgHref: "https://fluentacademy.co/#",
        period: "Dec 2025 – Present",
        bullets: [
          "Teach German to students from A1 to B1 level through structured individual and small-group lessons.",
          "Prepare lesson plans, explain grammar concepts clearly, and adapt teaching methods to different learning styles.",
          "Support students in developing speaking, listening, reading, and writing skills while monitoring their progress.",
        ],
      },
      {
        title: "Robotics Intern",
        org: "MindsInAction",
        orgHref: "https://mindsinaction.com.na/",
        period: "May 2025 – Aug 2025",
        bullets: [
          "Coached and mentored learners in robotics and basic programming, effectively adapting teaching explanations to individual learning levels and styles.",
          "Guided students using LEGO Mindstorms and NAO robots, providing structured instruction and one-on-one support to facilitate technical skill development.",
          "Supported knowledge transfer in workshops, strengthening instructional communication and clarity.",
        ],
      },
      {
        title: "Administrative & Accounting Assistant",
        org: "PyroNam",
        period: "Jun 2024 – Dec 2024",
        bullets: [
          "Communicated effectively with staff and clients when gathering required information and explaining documentation.",
          "Developed attention-to-detail skills essential for structured tasks and information management.",
        ],
      },
    ],
    skillsTitle: "Skills",
    skills: [
      { name: "Languages", items: "English (fluent), German (B2), Afrikaans (conversational)" },
      {
        name: "Teaching-Related",
        items: "Coaching, mentoring, lesson planning, grammar instruction, explanation skills, group communication, structured instruction",
      },
      { name: "Technical", items: "Java, Python, HTML/CSS, Git, Docker, VS Code, Linux, Sage Pastel" },
      { name: "Office Suite", items: "Microsoft Excel, Word, PowerPoint, Outlook" },
    ],
    exportLabel: "Export as PDF",
    downloadLabel: "Download PDF",
  },
}
