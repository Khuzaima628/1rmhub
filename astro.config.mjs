// StrengthCalc site configuration.
// The `site` value is the single source of truth for the live URL:
// canonical tags, the sitemap, robots.txt and social-share tags are all built
// from it. If the brand or domain ever changes, change it here and rebuild.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Free Cloudflare Pages subdomain for launch (no custom domain yet).
  site: 'https://strengthcalc.pages.dev',
  // Every page is a directory (/plate-calculator/index.html). Cloudflare Pages
  // redirects /plate-calculator → /plate-calculator/, so canonical URLs, the
  // sitemap and internal links all use the trailing slash.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    // Auto-generates sitemap-index.xml from the routes at every build.
    // Only canonical, indexable pages: the 404 page is excluded.
    sitemap({ filter: (page) => !page.includes('/404') }),
    // Lets guides live in src/content/guides/ as .mdx files.
    mdx(),
  ],
});
