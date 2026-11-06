// 1RMHub site configuration.
// The `site` value is the single source of truth for the live URL:
// canonical tags, the sitemap, robots.txt and social-share tags are all built
// from it. If the brand or domain ever changes, change it here and rebuild.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readdirSync, readFileSync } from 'node:fs';
import { SITE, reviewedFor } from './src/config/site.ts';

// <lastmod> for each sitemap URL, taken from the dates the pages themselves
// show — so search engines get the same date visitors see, never the build
// time. Guides: frontmatter `updated`, else `published`. Legal pages: the
// policy date. Everything else: the page's "Last reviewed" date (reviewedFor).
const LEGAL = ['/privacy/', '/terms/', '/disclaimer/'];
const GUIDES_DIR = new URL('./src/content/guides/', import.meta.url);
const guideDates = Object.fromEntries(
  readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx')).map((f) => {
    const front = readFileSync(new URL(f, GUIDES_DIR), 'utf8').split('---')[1] ?? '';
    const date = (key) => front.match(new RegExp(`^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
    const lastmod = date('updated') ?? date('published');
    if (!lastmod) throw new Error(`Guide ${f} has no published date for the sitemap.`);
    return [`/guides/${f.replace(/\.mdx$/, '')}/`, lastmod];
  }),
);
function lastmodFor(url) {
  const path = new URL(url).pathname;
  return guideDates[path] ?? (LEGAL.includes(path) ? SITE.policyDate : reviewedFor(path));
}

export default defineConfig({
  // Production custom domain on Cloudflare Pages.
  site: 'https://1rmhub.com',
  // Every page is a directory (/plate-calculator/index.html). Cloudflare Pages
  // redirects /plate-calculator → /plate-calculator/, so canonical URLs, the
  // sitemap and internal links all use the trailing slash.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    // Auto-generates sitemap-index.xml from the routes at every build.
    // Only canonical, indexable pages: the 404 page is excluded.
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url) }),
    }),
    // Lets guides live in src/content/guides/ as .mdx files.
    mdx(),
  ],
});
