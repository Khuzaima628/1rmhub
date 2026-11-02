// Notify IndexNow search engines (Bing, Yandex, Seznam, Naver, …) about the
// site's pages, so they recrawl them quickly. Run AFTER a deploy is live:
//
//   npm run indexnow                 → submits every URL in the live sitemap
//   npm run indexnow -- /a/ /b/      → submits only those paths
//
// The key file public/<KEY>.txt must stay deployed — engines fetch it to
// confirm the submission comes from the site owner. The key is not a secret.
import { readFileSync } from 'node:fs';

const KEY = '807576ada176516cddbb74850c38e78b';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const site = config.match(/site:\s*'([^']+)'/)?.[1];
if (!site) throw new Error('Could not read `site` from astro.config.mjs');
const origin = new URL(site).origin;

async function sitemapUrls() {
  const index = await (await fetch(`${origin}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map((p) => new URL(p, origin).href) : await sitemapUrls();
if (!urlList.length) throw new Error('No URLs to submit — is the site deployed?');

// Refuse to submit if the key file is not live yet (the engines would reject it).
const keyLocation = `${origin}/${KEY}.txt`;
const keyRes = await fetch(keyLocation);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  throw new Error(`Key file not live at ${keyLocation} — deploy first, then run again.`);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(origin).host, key: KEY, keyLocation, urlList }),
});
// 200 = accepted, 202 = accepted (key validation pending). Anything else is a failure.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
