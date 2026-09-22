/** @type {import('next').NextConfig} */
const nextConfig = {
  // Metadata is static here, so always render it in <head> instead of streaming it
  // into <body> — some crawlers and Lighthouse only read tags inside <head>.
  htmlLimitedBots: /.*/,
  experimental: {
    // The stylesheet is small; inlining it removes the render-blocking CSS request.
    inlineCss: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig