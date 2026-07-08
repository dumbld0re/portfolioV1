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
    phone: "+264 85 800 0433",
    email: "dannymiiguel@gmail.com",
    website: "dannymiguel.com",
    profileTitle: "Profil",
    profile:
      "Student der quantitativen Finanzwissenschaften mit Erfahrung im Deutschunterricht, in der Robotik-Ausbildung und in der administrativen Unterstützung. Geschickt darin, komplexe Konzepte klar zu erklären, mich an unterschiedliche Lernstile anzupassen und mit vielfältigen Gruppen zu arbeiten. Starke analytische, organisatorische und kommunikative Fähigkeiten mit einer strukturierten und zuverlässigen Herangehensweise an Problemlösungen.",
    educationTitle: "Ausbildung & Zertifikate",
    education: [
      {
        title: "University of Namibia (UNAM)",
        detail: "Bachelor of Science in Quantitative Finance",
        place: "Windhoek, NA",
        period: "Heute",
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
        title: "German Tutor (A1–B1)",
        org: "Fluent Academy",
        orgHref: "https://fluentacademy.co/#",
        period: "Dez 2025 – Heute",
        bullets: [
          "Unterrichte Deutsch für Lernende von Niveau A1 bis B1 in strukturiertem Einzel- und Kleingruppenunterricht.",
          "Erstelle Unterrichtspläne, erkläre Grammatikkonzepte klar und verständlich und passe die Lehrmethoden an unterschiedliche Lernstile an.",
          "Unterstütze Lernende beim Aufbau von Sprech-, Hör-, Lese- und Schreibfähigkeiten und verfolge ihren Fortschritt.",
        ],
      },
      {
        title: "Robotics Intern",
        org: "MindInAction",
        period: "Mai 2025 – Aug 2025",
        bullets: [
          "Lernende in Robotik und Programmier-Grundlagen gecoacht und Erklärungen an individuelle Lernniveaus angepasst.",
          "Schüler mit LEGO Mindstorms und NAO-Robotern angeleitet und strukturiertes Unterrichten sowie Einzelbetreuung gefestigt.",
          "Wissensvermittlung in Workshops unterstützt und Klarheit in der Kommunikation gestärkt.",
        ],
      },
      {
        title: "Administrative & Accounting Assistant",
        org: "PyroNam",
        period: "Jun 2024 – Dez 2024",
        bullets: [
          "Effektiv mit Mitarbeitenden und Kundschaft kommuniziert, um Informationen einzuholen und Unterlagen zu erklären.",
          "Detailgenauigkeit entwickelt – eine Kernkompetenz für strukturierte Aufgaben und Informationsmanagement.",
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
      { name: "Technisch", items: "Java, Python, HTML/CSS, Git, Docker, VS Code, Linux, Sage Pastel" },
      { name: "Office", items: "Microsoft Excel, Word, PowerPoint, Outlook" },
    ],
    exportLabel: "Als PDF exportieren",
    downloadLabel: "PDF herunterladen",
  },
  en: {
    label: "Curriculum Vitae",
    name: "Danny-Miguel Mittelberger",
    phone: "+264 85 800 0433",
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
        org: "MindInAction",
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
