/**
 * Built-site checks: run AFTER `npm run build` (use `npm run verify`).
 *
 * Reads every HTML file in dist/ and checks the things that silently hurt
 * search visibility or trust: titles, descriptions, canonicals, headings,
 * JSON-LD validity and honesty, internal links, the sitemap and robots.txt.
 * No browser and no extra dependencies — plain string parsing of static HTML.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const SITE = 'https://strengthcalc.pages.dev';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** dist/a/b/index.html → /a/b/ ; dist/index.html → / ; dist/404.html → /404 */
function routeOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

let pages = [];

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error('dist/ not found — run `npm run build` first (or `npm run verify`).');
  pages = walk(DIST).filter((f) => f.endsWith('.html')).map((file) => {
    const html = readFileSync(file, 'utf8');
    const route = routeOf(file);
    return { file, route, html, is404: route === '/404' };
  })
    // Skip non-page .html files such as Google's site-verification file.
    .filter((p) => /<html[\s>]/i.test(p.html));
});

const indexable = () => pages.filter((p) => !p.is404);

describe('every indexable page has complete, unique metadata', () => {
  it('builds the expected set of pages', () => {
    const routes = indexable().map((p) => p.route).sort();
    expect(routes).toEqual([
      '/', '/1rm-percentage-calculator/', '/about/', '/barbell-row-calculator/', '/bench-press-calculator/',
      '/contact/', '/deadlift-calculator/', '/disclaimer/', '/guides/', '/guides/1rm-formulas/',
      '/guides/how-to-test-1rm/', '/guides/training-max/', '/methodology/', '/overhead-press-calculator/', '/plate-calculator/',
      '/privacy/', '/rpe-calculator/', '/squat-calculator/', '/terms/', '/warm-up-calculator/', '/dots-calculator/',
    ].sort());
  });

  it('one <title> (≤ 65 chars) and one meta description (70–160 chars) per page, all unique', () => {
    const titles = new Set();
    const descs = new Set();
    for (const p of indexable()) {
      const t = [...p.html.matchAll(/<title>([^<]*)<\/title>/g)];
      expect(t, p.route).toHaveLength(1);
      const title = decode(t[0][1]);
      expect(title.length, `${p.route} title: ${title}`).toBeLessThanOrEqual(65);
      const d = [...p.html.matchAll(/<meta name="description" content="([^"]*)"/g)];
      expect(d, p.route).toHaveLength(1);
      const desc = decode(d[0][1]);
      expect(desc.length, `${p.route} description length`).toBeGreaterThanOrEqual(70);
      expect(desc.length, `${p.route} description length`).toBeLessThanOrEqual(160);
      expect(titles.has(title), `duplicate title ${title}`).toBe(false);
      expect(descs.has(desc), `duplicate description on ${p.route}`).toBe(false);
      titles.add(title);
      descs.add(desc);
    }
  });

  it('absolute, self-referencing canonical with trailing slash; no noindex', () => {
    for (const p of indexable()) {
      const c = [...p.html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
      expect(c, p.route).toHaveLength(1);
      expect(c[0][1]).toBe(`${SITE}${p.route}`);
      expect(p.html, p.route).not.toMatch(/name="robots" content="[^"]*noindex/);
    }
  });

  it('Open Graph + Twitter tags present and the og:image file exists', () => {
    expect(existsSync(join(DIST, 'og-image.png'))).toBe(true);
    for (const p of indexable()) {
      for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:site_name']) {
        expect(p.html, `${p.route} ${prop}`).toContain(`property="${prop}"`);
      }
      expect(p.html).toContain('name="twitter:card" content="summary_large_image"');
    }
  });

  it('html lang, viewport and charset on every page', () => {
    for (const p of pages) {
      expect(p.html).toMatch(/<html lang="en"/);
      expect(p.html).toContain('name="viewport"');
      expect(p.html).toMatch(/<meta charset="utf-8"/i);
    }
  });
});

describe('content structure', () => {
  it('exactly one <h1> and no skipped heading levels', () => {
    for (const p of pages) {
      const main = p.html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
      const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      expect(levels.filter((l) => l === 1), p.route).toHaveLength(1);
      expect(levels[0], p.route).toBe(1);
      for (let i = 1; i < levels.length; i += 1) {
        expect(levels[i] - levels[i - 1], `${p.route}: h${levels[i - 1]} → h${levels[i]}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it('no leaked "undefined", "NaN", "[object Object]" or unfinished-phase wording', () => {
    for (const p of pages) {
      const t = text(p.html);
      expect(t, p.route).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]/);
      expect(t, p.route).not.toMatch(/later phase|coming soon|lorem ipsum/i);
    }
  });

  it('every table has a caption and no empty header cells', () => {
    for (const p of pages) {
      for (const t of p.html.match(/<table[\s\S]*?<\/table>/g) ?? []) {
        expect(t, `${p.route} table without <caption>`).toMatch(/<caption>/);
        expect(t, `${p.route} empty <th>`).not.toMatch(/<th[^>]*>\s*<\/th>/);
      }
    }
  });

  it('every image has alt text', () => {
    for (const p of pages) {
      for (const [tag] of p.html.matchAll(/<img\b[^>]*>/g)) expect(tag, p.route).toMatch(/\salt="/);
    }
  });

  it('“Average Estimate” is never described as validated or consensus', () => {
    for (const p of pages) {
      const t = text(p.html);
      expect(t, p.route).not.toMatch(/Average Estimate[^.]{0,60}\b(is|as) (a |the )?(scientifically )?validated/i);
      expect(t, p.route).not.toMatch(/Average Estimate (is|as) (a |the )?consensus/i);
    }
  });
});

describe('links', () => {
  it('every internal link resolves to a built page or file, with a trailing slash for pages', () => {
    const routes = new Set(pages.map((p) => p.route));
    for (const p of pages) {
      for (const [tag] of p.html.matchAll(/<a\b[^>]*>/g)) {
        const href = attr(tag, 'href');
        if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
        const path = decode(href).split(/[?#]/)[0];
        if (/\.[a-z0-9]+$/i.test(path)) {
          expect(existsSync(join(DIST, path)), `${p.route} → ${href}`).toBe(true);
        } else {
          expect(path.endsWith('/'), `${p.route} → ${href} (missing trailing slash)`).toBe(true);
          expect(routes.has(path), `${p.route} → ${href} (no such page)`).toBe(true);
        }
      }
    }
  });

  it('no orphan pages: every indexable page is linked from at least one other page', () => {
    const linked = new Set();
    for (const p of pages) {
      for (const [, href] of p.html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) if (href !== p.route) linked.add(href);
    }
    for (const p of indexable()) if (p.route !== '/') expect(linked.has(p.route), `orphan: ${p.route}`).toBe(true);
  });

  it('links opening a new tab use rel="noopener"', () => {
    for (const p of pages) {
      for (const [tag] of p.html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) expect(tag, p.route).toMatch(/rel="[^"]*noopener/);
    }
  });
});

describe('structured data', () => {
  const graphs = () => indexable().map((p) => {
    const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(blocks, `${p.route} JSON-LD blocks`).toHaveLength(1);
    return { p, data: JSON.parse(blocks[0][1]) };
  });

  it('valid JSON with one @graph containing WebSite, Organization and a WebPage-type node', () => {
    for (const { p, data } of graphs()) {
      expect(data['@context']).toBe('https://schema.org');
      const types = data['@graph'].map((n) => n['@type']);
      expect(types, p.route).toContain('WebSite');
      expect(types, p.route).toContain('Organization');
      expect(types.some((t) => /Page$/.test(t)), p.route).toBe(true);
    }
  });

  it('no fabricated ratings or reviews; the only Person is the real editor named on About', () => {
    const about = pages.find((x) => x.route === '/about/');
    for (const { p, data } of graphs()) {
      const json = JSON.stringify(data);
      expect(json, p.route).not.toMatch(/aggregateRating|"review"|"Review"/);
      const people = data['@graph'].filter((n) => n['@type'] === 'Person');
      expect(people.length, p.route).toBeLessThanOrEqual(1);
      for (const person of people) {
        expect(person.name).toBe('Muhammad Khuzaima');
        expect(person.url).toBe(`${SITE}/about/#editor`);
        expect(text(about.html)).toContain(person.name);
        expect(about.html).toContain('id="editor"');
      }
    }
  });

  it('guide articles are authored by the editor and bylined visibly', () => {
    for (const { p, data } of graphs()) {
      const article = data['@graph'].find((n) => n['@type'] === 'Article');
      if (!article) continue;
      expect(article.author['@id'], p.route).toBe(`${SITE}/#editor`);
      expect(p.html, p.route).toMatch(/By <a href="\/about\/#editor" rel="author">Muhammad Khuzaima<\/a>/);
    }
  });

  it('BreadcrumbList matches the visible breadcrumb on every non-home page', () => {
    for (const { p, data } of graphs()) {
      const crumbs = data['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
      if (p.route === '/') { expect(crumbs).toBeUndefined(); continue; }
      expect(crumbs, p.route).toBeDefined();
      const nav = p.html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0];
      expect(nav, p.route).toBeDefined();
      const visible = [...nav.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]).trim());
      expect(crumbs.itemListElement.map((i) => i.name)).toEqual(visible);
      expect(crumbs.itemListElement.at(-1).item).toBe(`${SITE}${p.route}`);
    }
  });

  it('FAQPage only where every question and answer is visible on the page', () => {
    for (const { p, data } of graphs()) {
      const faq = data['@graph'].find((n) => n['@type'] === 'FAQPage');
      if (!faq) continue;
      const visible = text(p.html);
      for (const q of faq.mainEntity) {
        expect(visible, `${p.route} question`).toContain(q.name);
        expect(visible, `${p.route} answer`).toContain(q.acceptedAnswer.text);
      }
    }
  });

  it('only the homepage carries FAQPage (no repeated FAQ markup)', () => {
    const withFaq = graphs().filter(({ data }) => data['@graph'].some((n) => n['@type'] === 'FAQPage')).map(({ p }) => p.route);
    expect(withFaq).toEqual(['/']);
  });
});

describe('sitemap, robots and 404', () => {
  it('sitemap lists exactly the canonical, indexable pages', () => {
    const index = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
    const files = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
    const urls = files.flatMap((f) => [...readFileSync(join(DIST, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    expect(urls.sort()).toEqual(indexable().map((p) => `${SITE}${p.route}`).sort());
  });

  it('every sitemap URL has a lastmod matching the date the page itself shows', () => {
    const index = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
    const files = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
    const entries = files.flatMap((f) => [...readFileSync(join(DIST, f), 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]));
    expect(entries.length).toBe(indexable().length);
    for (const e of entries) {
      const loc = e.match(/<loc>([^<]+)<\/loc>/)[1];
      const lastmod = e.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      expect(lastmod, loc).toMatch(/^\d{4}-\d{2}-\d{2}/);
      const page = pages.find((p) => `${SITE}${p.route}` === loc);
      // Guides show their date in article:modified_time; it must agree.
      const modified = page.html.match(/property="article:modified_time" content="([^"]+)"/)?.[1];
      if (modified) expect(lastmod.slice(0, 10), loc).toBe(modified.slice(0, 10));
      // Calculator pages show "Last reviewed <time datetime=…>"; it must agree too.
      const reviewed = page.html.match(/Last reviewed <time datetime="(\d{4}-\d{2}-\d{2})"/)?.[1];
      if (reviewed) expect(lastmod.slice(0, 10), loc).toBe(reviewed);
    }
  });

  it('/sitemap.xml redirects to the sitemap index', () => {
    const redirects = readFileSync(join(DIST, '_redirects'), 'utf8');
    expect(redirects).toMatch(/^\/sitemap\.xml \/sitemap-index\.xml 301$/m);
  });

  it('robots.txt allows crawling and points to the sitemap on the configured site', () => {
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    expect(robots).toMatch(/User-agent: \*\nAllow: \//);
    expect(robots).not.toMatch(/Disallow: \/\s*$/m);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
  });

  it('404 page exists, is noindex, and has no canonical or JSON-LD', () => {
    const p = pages.find((x) => x.is404);
    expect(p).toBeDefined();
    expect(p.html).toContain('name="robots" content="noindex, follow"');
    expect(p.html).not.toContain('rel="canonical"');
    expect(p.html).not.toContain('application/ld+json');
  });

});

// Ads are switched by PUBLIC_ADSENSE_CLIENT at build time (src/config/ads.ts);
// these checks follow the same variable, so they hold in both modes.
describe('advertising switch', () => {
  const client = (process.env.PUBLIC_ADSENSE_CLIENT ?? '').trim();
  const privacy = () => pages.find((p) => p.route === '/privacy/').html;

  it('the privacy policy description does not deny the analytics the site uses', () => {
    expect(privacy()).not.toMatch(/name="description" content="[^"]*no analytics/i);
  });

  if (!client) {
    it('no ad code and no ads.txt ship while ads are disabled', () => {
      for (const p of pages) expect(p.html, p.route).not.toMatch(/adsbygoogle|pagead2\.googlesyndication/);
      expect(existsSync(join(DIST, 'ads.txt'))).toBe(false);
      expect(privacy()).not.toContain('Advertising and cookies');
    });
  } else {
    it('ads.txt holds exactly Google\'s line for this publisher', () => {
      expect(readFileSync(join(DIST, 'ads.txt'), 'utf8'))
        .toBe(`google.com, ${client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
    });

    it('the AdSense loader is on every page exactly once, for this publisher', () => {
      for (const p of pages) {
        const loaders = p.html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([\w-]+)/g) ?? [];
        expect(loaders, p.route).toEqual([`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`]);
      }
    });

    it('the privacy policy carries Google\'s required advertising disclosures', () => {
      const t = text(privacy());
      expect(t).toContain('Third-party vendors, including Google, use cookies to serve ads based on your prior visits');
      expect(privacy()).toContain('https://adssettings.google.com/');
      expect(privacy()).toContain('https://policies.google.com/technologies/partner-sites');
      expect(t).not.toContain('shows no ads');
    });
  }
});
