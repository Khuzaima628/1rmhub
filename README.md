# 1RMHub

Live site: https://1rmhub.com/

Free, transparent one rep max (1RM) calculator — six published formulas, training percentages, a plate loader and a warm-up generator. Static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server |
| `npm test` | Formula and calculator unit tests |
| `npm run build` | Production build to `dist/` |
| `npm run verify` | Unit tests + build + checks on the built site (SEO, links, schema, sitemap) |

## Configuration

- Live URL: `site` in `astro.config.mjs` (canonicals, sitemap and robots.txt are built from it).
- Contact email, default unit and policy dates: `src/config/site.ts`.
- Ads stay disabled until `PUBLIC_ADSENSE_CLIENT` (e.g. `ca-pub-` + 16 digits) is set at build time. That one switch publishes `/ads.txt`, adds the AdSense loader and the privacy-policy ad disclosures — read `src/config/ads.ts` first.

## Cloudflare Pages build settings

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION` = `22`
