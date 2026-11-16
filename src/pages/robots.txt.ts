// robots.txt generated from the `site` config value, so the sitemap URL can
// never point at an old domain. Everything is crawlable: shareable calculator
// URLs carry query parameters, but their canonical tag points at the clean URL.
// AI search and assistant crawlers are named explicitly so it is unambiguous
// that they may read and cite the site (the `*` group already allows them).
import type { APIRoute } from 'astro';

const AI_CRAWLERS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const ai = AI_CRAWLERS.map((bot) => `User-agent: ${bot}\nAllow: /\n`).join('\n');
  const body = `User-agent: *\nAllow: /\n\n${ai}\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
