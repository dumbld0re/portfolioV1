import { execSync } from "node:child_process"

// The footer's "last updated" date: the day of the latest commit, or the build
// day when git history isn't available.
function lastUpdated() {
  try {
    return execSync("git log -1 --format=%cs", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LAST_UPDATED: lastUpdated(),
  },
  // Metadata is static here, so always render it in <head> instead of streaming it
  // into <body> — some crawlers and Lighthouse only read tags inside <head>.
  htmlLimitedBots: /.*/,
  experimental: {
    // The stylesheet is small; inlining it removes the render-blocking CSS request.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig