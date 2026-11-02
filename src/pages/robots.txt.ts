// robots.txt generated from the `site` config value, so the sitemap URL can
// never point at an old domain. Everything is crawlable: shareable calculator
// URLs carry query parameters, but their canonical tag points at the clean URL.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
