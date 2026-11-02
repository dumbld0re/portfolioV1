import { permanentRedirect } from "next/navigation"

// The CV lives as a PDF now (the "cv" menu in the nav offers download or view).
// Old /cv and /de/cv links land on the file itself.
export default function CvPage() {
  permanentRedirect("/cv.pdf")
}
