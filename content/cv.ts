import type { Language } from "@/lib/i18n"

type CvEntry = {
  title: string
  org: string
  period: string
  bullets: string[]
}

type CvData = {
  label: string
  name: string
  phone: string
  email: string
  profileTitle: string
  profile: string
  educationTitle: string
  education: { title: string; detail: string; place: string; period: string }[]
  experienceTitle: string
  experience: CvEntry[]
  projectsTitle: string
  projects: CvEntry[]
  skillsTitle: string
  skills: { name: string; items: string }[]
  exportLabel: string
  downloadLabel: string
}

export const cvContent: Record<Language, CvData> = {
  de: {
    label: "Lebenslauf",
    name: "Danny-Miguel Mittelberger",
    phone: "+264 85 8000 433",
    email: "mittelberger2007@gmail.com",
    profileTitle: "Profil",
    profile:
      "Anpassungsfähige und detailorientierte Persönlichkeit mit ausgeprägten Kommunikations-, Problemlöse- und Organisationsfähigkeiten. Ich lerne schnell, arbeite gut unter Druck und gehe Aufgaben ruhig und strukturiert an. Sicher im Umgang mit Menschen, im verständlichen Erklären von Konzepten und im sorgfältigen Umgang mit Verantwortung. Durchgehend zuverlässig, motiviert und der Qualität meiner Arbeit verpflichtet.",
    educationTitle: "Ausbildung & Zertifikate",
    education: [
      {
        title: "Eran Academy",
        detail: "International AS und A Level",
        place: "Windhoek, NA",
        period: "2025",
      },
      {
        title: "Delta Secondary School Windhoek",
        detail: "NSSCO",
        place: "Windhoek, NA",
        period: "Jan 2021 – Nov 2024",
      },
      {
        title: "Deutsches Sprachdiplom der Kultusministerkonferenz – Stufe I (DSD I)",
        detail: "Deutsches Sprachzertifikat (B2)",
        place: "Windhoek, NA",
        period: "2024",
      },
    ],
    experienceTitle: "Erfahrung",
    experience: [
      {
        title: "Learner Fundraiser Committee (LFC)",
        org: "Delta Secondary School Windhoek",
        period: "Jan 2022 – Sep 2024",
        bullets: [
          "Ideen und Updates vor Schüler- und Lehrergruppen präsentiert und dabei Kommunikations- und Vortragsfähigkeiten gestärkt.",
          "Mit vielfältigen Schülergruppen zusammengearbeitet und Beteiligung sowie Teamarbeit gefördert.",
          "Schulveranstaltungen organisiert, die Planung, Koordination und klare Anweisungen erforderten.",
        ],
      },
      {
        title: "Administrative & Accounting Assistant",
        org: "PyroNam",
        period: "Jun 2024 – Dez 2024",
        bullets: [
          "Effektiv mit Mitarbeitenden und Kundschaft kommuniziert, um Informationen einzuholen und Unterlagen zu erklären.",
          "Detailgenauigkeit entwickelt – eine Kernkompetenz für Aufgaben wie Korrektur und Unterrichtsvorbereitung.",
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
    ],
    projectsTitle: "Projekte",
    projects: [
      {
        title: "NamWeb Collective",
        org: "",
        period: "Mai 2025 – Heute",
        bullets: [
          "Arbeit mit Kundschaft, die klare Erklärungen und strukturierte Kommunikation im Stil einer Lehrumgebung erfordert.",
          "Entwicklung von Online-Ressourcen, die Nutzenden den Umgang mit digitalen Werkzeugen vermitteln.",
        ],
      },
    ],
    skillsTitle: "Kenntnisse",
    skills: [
      { name: "Sprachen", items: "Englisch (fließend), Deutsch (B2), Afrikaans (Konversation)" },
      { name: "Vermittlung", items: "Coaching, Erklärkompetenz, Gruppenkommunikation, Unterrichtsunterstützung" },
      { name: "Technisch", items: "Java, Python, HTML/CSS, Git, Docker, VS Code, Linux" },
      { name: "Office", items: "Excel, Word, PowerPoint, Outlook" },
    ],
    exportLabel: "Als PDF exportieren",
    downloadLabel: "PDF herunterladen",
  },
  en: {
    label: "Curriculum Vitae",
    name: "Danny-Miguel Mittelberger",
    phone: "+264 85 8000 433",
    email: "mittelberger2007@gmail.com",
    profileTitle: "Profile",
    profile:
      "Adaptable and detail-driven individual with strong communication, problem-solving, and organisational skills. I learn quickly, work well under pressure, and bring a calm, structured approach to tasks. Confident in working with people, explaining concepts clearly, and handling responsibilities with care. Consistently reliable, motivated, and committed to delivering high-quality work across different roles.",
    educationTitle: "Education & Certification",
    education: [
      {
        title: "Eran Academy",
        detail: "International AS and A Level",
        place: "Windhoek, NA",
        period: "2025",
      },
      {
        title: "Delta Secondary School Windhoek",
        detail: "NSSCO",
        place: "Windhoek, NA",
        period: "Jan 2021 – Nov 2024",
      },
      {
        title: "Deutsches Sprachdiplom der Kultusministerkonferenz – Stufe I (DSD I)",
        detail: "German Language Certification (B2)",
        place: "Windhoek, NA",
        period: "2024",
      },
    ],
    experienceTitle: "Experience",
    experience: [
      {
        title: "Learner Fundraiser Committee (LFC)",
        org: "Delta Secondary School Windhoek",
        period: "Jan 2022 – Sep 2024",
        bullets: [
          "Presented ideas and updates to groups of students and teachers, strengthening communication and public-speaking skills.",
          "Collaborated with diverse student groups, encouraging participation and teamwork.",
          "Organized school events requiring planning, coordination, and clear instruction delivery.",
        ],
      },
      {
        title: "Administrative & Accounting Assistant",
        org: "PyroNam",
        period: "Jun 2024 – Dec 2024",
        bullets: [
          "Communicated effectively with staff and clients when gathering required information and explaining documentation.",
          "Developed attention-to-detail skills essential for teaching tasks such as marking and lesson prep.",
        ],
      },
      {
        title: "Robotics Intern",
        org: "MindInAction",
        period: "May 2025 – Aug 2025",
        bullets: [
          "Coached learners in robotics and basic programming, adapting explanations to individual learning levels.",
          "Guided students using LEGO Mindstorms and NAO robots, reinforcing structured teaching and one-on-one support.",
          "Supported knowledge transfer in workshops, strengthening clarity and instructional communication.",
        ],
      },
    ],
    projectsTitle: "Projects",
    projects: [
      {
        title: "NamWeb Collective",
        org: "",
        period: "May 2025 – Present",
        bullets: [
          "Work with clients, requiring clear explanations and structured communication suited to a teaching environment.",
          "Develop online resources that train users to navigate and understand digital tools.",
        ],
      },
    ],
    skillsTitle: "Skills",
    skills: [
      { name: "Languages", items: "English (fluent), German (B2), Afrikaans (conversational)" },
      { name: "Teaching-Related", items: "Coaching, explanation skills, group communication, lesson support" },
      { name: "Technical", items: "Java, Python, HTML/CSS, Git, Docker, VS Code, Linux" },
      { name: "Office Suite", items: "Excel, Word, PowerPoint, Outlook" },
    ],
    exportLabel: "Export as PDF",
    downloadLabel: "Download PDF",
  },
}
