# Domain Migration Plan: StrengthCalc to 1RMHub

**Move:** `https://strengthcalc.pages.dev/` → `https://1rmhub.com/`
**Plan written:** 2026-11-06
**Repo state inspected:** branch `main`, commit `2751a93`, clean working tree
**Status:** research and planning only. Nothing has been migrated.

## Progress update, 2026-11-07

**This section is the current state. Where it differs from the original plan below, this section wins.**

### What changed from the original plan

| Topic | Original plan | What actually happened |
|---|---|---|
| Cloudflare project | Keep `strengthcalc` | New project `1rmhub` created; `1rmhub.pages.dev` is its free address |
| Old project | Keep connected | `strengthcalc` still exists but is disconnected from Git, so it no longer updates |
| GitHub repo | Keep `Khuzaima628/strengthcalc` | Renamed to `Khuzaima628/1rmhub`; local remote updated |
| Package name | Keep `strengthcalc` | Renamed to `1rmhub`, following "nothing old" |
| About page note (D5) | "Previously called StrengthCalc" | Not added, following "nothing old" |
| Brand spelling (D2) | `1RMHub` | `1RMHub`, as specified in the implementation brief |
| Stage order | Code before domain | Domain connected first; code is on a branch and not live |

### Status

**External setup (seen in your screenshots or tested from here)**
- [x] `1rmhub.com` added to Cloudflare, Free plan, status Active
- [x] Nameservers changed to `giancarlo.ns.cloudflare.com` and `liz.ns.cloudflare.com` (registry confirmed)
- [x] Custom domain on project `1rmhub`, status Active
- [x] HTTPS works and `http://` redirects to `https://` (tested directly against Cloudflare, before the code change)
- [ ] `1rmhub.com` opens on your own Wi-Fi: **not confirmed**; your router still had no address on the last check
- [ ] `www.1rmhub.com`: not set up; the name doesn't resolve yet
- [ ] Web Analytics on the new project: not turned on; no beacon found on `1rmhub.pages.dev`
- [ ] Old-address redirect: **not set up, waiting for your decision**
- [ ] Old project deleted: not done; do not delete before the code is live
- [ ] Google Search Console, new site: not done
- [ ] Bing Webmaster Tools, new site: not done
- [ ] IndexNow for the new domain: not run

**Code (branch `migration/1rmhub`, local tag `pre-1rmhub-migration`)**
- [x] Public brand changed to `1RMHub`
- [x] `site` changed to `https://1rmhub.com`
- [x] New share image with the same design and size (1200 × 630)
- [x] Legal "last updated" date changed to 2026-11-07
- [x] Test added: no built file may contain the old brand or production address
- [x] `npm run verify`: 95 unit tests and 28 site tests pass
- [x] Real-browser test on the local build: 22 pages at 2 widths
- [ ] **Merged to `main` and live: not done, needs your approval**

### Still open

1. **Approve the push to `main`.**
2. **Old-address redirect.** Because the old project is disconnected, the new code will never reach it. Its pages keep telling Google that `strengthcalc.pages.dev` is the main address. A Cloudflare Bulk Redirect (section 7.5) is the documented way to fix this. You said no redirect earlier, while the implementation brief asks for one, so this needs your final answer.
3. **Contact email.** `strengthcalc.team@outlook.com` is the only old name left. It appears on the site and in Google data, and stays until you give me a new working address.

---

## How to use this plan

We run one stage at a time. Every stage stops for approval before the next one starts.

| Mark | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[v]` | Completed and verified |
| **VERIFIED** | Checked in the repo, on the live site, or in official docs |
| **INFERRED** | My conclusion from verified facts; the docs do not say it directly |
| **UNVERIFIED** | Could not be confirmed; we check it when we reach that step |

Markdown only renders `[ ]` and `[x]` as checkboxes. `[~]` and `[v]` will appear as plain text.

---

## 1. Executive summary

The move is low risk and needs few code changes. Every page keeps its path. The site address is hardcoded in only two places, and everything else is built from them. The site has very little search history to lose: at the last check, Google showed about 4 pages and clicks were close to zero.

The main work is in the dashboards, and it has to be done in the right order.

**Most important findings**

1. **The domain is not connected yet.** `1rmhub.com` still uses Hostinger's parking nameservers and shows a parking page.
2. **Nameservers must move to Cloudflare.** Cloudflare requires this for a main domain like `1rmhub.com`. Hostinger stays only as the registrar.
3. **`_redirects` cannot move the old address.** Cloudflare does not support domain-level redirects in that file. The official method for `pages.dev` is **Bulk Redirects**, which is on the Free plan.
4. **Redirects conflict with the old Google verification file.** Google will not follow a verification-file redirect to another domain. Old-property access may lapse after the redirect, so Change of Address has to be done promptly.
5. **Change of Address probably applies.** Google's docs accept subdomain-level sites such as `m.example.com`. I could not confirm how the tool treats `pages.dev` until we run it.
6. **Branding exists in one image.** `public/og-image.png` shows the "StrengthCalc" wordmark and must be regenerated. The logo, favicon and Apple touch icon have no text.
7. **Code must not go live before the domain is Active.** Pushing to `main` deploys immediately. Early deployment would point canonical links at a domain that does not work yet.
8. **Corrections to my earlier advice:**
   - The official `www` setup is a Bulk Redirect plus a proxied DNS record. It does not add `www` under Custom domains, as I told you earlier.
   - Don't remove the old site from Search Console yet. Change of Address needs you to own both properties.
   - I earlier suggested no redirect, because you preferred that. This plan recommends one, because it is Google's strongest signal and Change of Address requires it. **The final choice is yours (Decision D1).**

**Decisions needed:** see [section 17](#17-open-questions-and-items-requiring-your-action).

---

## 2. Current architecture (VERIFIED)

| Area | Current state | Source |
|---|---|---|
| Framework | Astro 7.3.8, static output, directory format, `trailingSlash: 'always'` | `astro.config.mjs`, `node_modules` |
| Integrations | `@astrojs/sitemap` 3.7.4, `@astrojs/mdx` 8.0.3 | `node_modules` |
| Tests | Vitest 5.0.5; `npm run verify` runs unit tests, the build and built-site tests | `package.json` |
| Hosting | Cloudflare Pages; a push to `main` deploys | `README.md`, earlier deployments |
| Build settings | Preset Astro, `npm run build`, output `dist`, `NODE_VERSION=22` | `README.md` (dashboard not seen) |
| Repo config | No `wrangler` file, no `.env`, no GitHub workflows | Repo listing |
| Site address | `site` in `astro.config.mjs:33` is the single source for built URLs | Code |
| Canonical links | `BaseLayout.astro` builds `site + path`; `Seo.astro` prints them | Code |
| Sitemap | `sitemap-index.xml` → `sitemap-0.xml`, 22 URLs | Live site |
| robots.txt | `src/pages/robots.txt.ts`, built from `site` | Code and live site |
| JSON-LD | `src/lib/schema.ts`, built from `site`; name from `SITE.name` | Code |
| Self-links | Internal links are relative; no hardcoded self-links found | `git grep` |
| Redirect file | `/sitemap.xml` → `/sitemap-index.xml` (301) | `public/_redirects`, live site |
| Trailing slash | `/bench-press-calculator` → `/bench-press-calculator/` (308) | Live site |
| Headers | Security headers and asset caching; no CSP and no host-specific rule | `public/_headers` |
| IndexNow | `scripts/indexnow.mjs` reads `site` from config; key file in `public/` | Code |
| Google verification | HTML file `public/google9f1b21d879660ecb.html`, property on `pages.dev` | Repo, live site |
| Analytics | Cloudflare Web Analytics beacon injected by Cloudflare; not in repo | Live HTML, `git grep` |
| Google Analytics | Not present | `git grep` |
| Ads | Off until `PUBLIC_ADSENSE_CLIENT` is set; `/ads.txt` currently returns 404 | `src/config/ads.ts`, live site |
| Contact | Email link only, no contact form | `ContactEmail.astro` |

**New domain state (VERIFIED on 2026-11-06)**

| Item | Value |
|---|---|
| Registered / expires | 2026-11-06 / 2027-11-06 |
| Registrar status | `client transfer prohibited` (does not block nameserver changes) |
| Nameservers | `atlas.dns-parking.com`, `hyperion.dns-parking.com` |
| Root A record | `2.57.91.91` (parking) |
| `www` | CNAME to `1rmhub.com` |
| DNSSEC | Not signed, so nothing to turn off |
| MX, TXT, CAA | None, so no email or certificate conflict |

---

## 3. Target architecture

| Area | Target |
|---|---|
| Main address | `https://1rmhub.com/` |
| `www.1rmhub.com` | 301 to `https://1rmhub.com/`, keeping path and query |
| `http://` | Redirects to `https://` |
| `strengthcalc.pages.dev` | 301 to the same path on `1rmhub.com` (Decision D1) |
| Hosting | Same Cloudflare Pages project, free |
| Registrar | Hostinger, domain only |
| DNS | Cloudflare, Free plan |
| Public name | `1RMHub` |
| Technical names | Repo, Cloudflare project and package name stay as they are |

---

## 4. Current versus target

| Item | Current | Target | Change type |
|---|---|---|---|
| Canonical, Open Graph, JSON-LD and sitemap host | `strengthcalc.pages.dev` | `1rmhub.com` | Automatic from `site` |
| robots.txt Sitemap line | Old host | New host | Automatic from `site` |
| WebSite `alternateName` | `strengthcalc.pages.dev` | `1rmhub.com` | Automatic from `site` |
| IndexNow host and key location | Old host | New host | Automatic from `site`; same key |
| Site name | StrengthCalc | 1RMHub | Code |
| Share image | Shows StrengthCalc | Shows 1RMHub | New image |
| Search Console | Old URL-prefix property | New Domain property | Dashboard |
| Bing | Old site | New site | Dashboard |
| Page paths | Unchanged | Unchanged | None |
| Calculators and formulas | Unchanged | Unchanged | None |

---

## 5. Complete change inventory

**Action types:** Replace, Add, Remove, Keep, Cloudflare dashboard, Google/Bing dashboard, Your manual action.
**Priority:** P1 needed for the move, P2 should be done, P3 optional.

### A. Brand and website identity

| Item | Current value | Target value | File/location | Action | Priority |
|---|---|---|---|---|---|
| Site name | `StrengthCalc` | `1RMHub` | `src/config/site.ts:6` | Replace | P1 |
| Header wordmark | `Strength<span>Calc</span>` | `1RM<span>Hub</span>` | `src/components/Header.astro:11` | Replace | P1 |
| Header label | `StrengthCalc home` | `1RMHub home` | `Header.astro:11` | Replace | P1 |
| Footer heading | `StrengthCalc` | `1RMHub` | `src/config/site.ts:112` | Replace | P1 |
| Footer copyright | From `SITE.name` | Updates itself | `Footer.astro:25` | Keep | – |
| Editor bio | `creator and editor of StrengthCalc` | `...of 1RMHub` | `src/config/site.ts:46` | Replace | P1 |
| Homepage title | `... \| StrengthCalc` | `... \| 1RMHub` | `src/pages/index.astro:14` | Replace | P1 |
| Homepage print header | `StrengthCalc — One Rep Max Calculator` | `1RMHub — One Rep Max Calculator` | `index.astro:86` | Replace | P1 |
| Homepage FAQ and app name | Mentions StrengthCalc | 1RMHub | `index.astro:34`, `:69` | Replace | P1 |
| About title and description | StrengthCalc | 1RMHub | `src/pages/about.astro:8`, `:10` | Replace | P1 |
| About "formerly" note | None | "1RMHub was previously called StrengthCalc." | `about.astro` | Add (Decision D5) | P2 |
| Contact title and description | StrengthCalc | 1RMHub | `src/pages/contact.astro:7`, `:9` | Replace | P1 |
| Methodology title, description, text | StrengthCalc | 1RMHub | `src/pages/methodology.astro:9`, `:11`, `:23` | Replace | P1 |
| Guides index description | StrengthCalc | 1RMHub | `src/pages/guides/index.astro:10` | Replace | P1 |
| Guide text | StrengthCalc | 1RMHub | `1rm-formulas.mdx:43,74,81,83`, `training-max.mdx:56` | Replace | P1 |
| Calculator text | StrengthCalc | 1RMHub | `overhead-press-calculator.astro:45`, `plate-calculator.astro:51` | Replace | P1 |
| Table caption | `...used by StrengthCalc` | `...used by 1RMHub` | `FormulaTable.astro:6` | Replace | P1 |
| Printed result | `StrengthCalc result — ...` | `1RMHub result — ...` | `OneRepMaxCalculator.astro:201` | Replace | P1 |
| Copied result | `StrengthCalc 1RM estimate` | `1RMHub estimate` | `OneRepMaxCalculator.astro:256` | Replace | P1 |
| Related-link text | `...number on StrengthCalc...` | `...number on 1RMHub...` | `src/data/links.ts:18` | Replace | P1 |
| Legal titles and descriptions | StrengthCalc | 1RMHub | `privacy.astro:13,14,17`, `terms.astro:7,9`, `disclaimer.astro:7,9` | Replace | P1 |
| Legal "last updated" date | `2026-11-02` | Date of the rename | `SITE.policyDate`, `site.ts:16` | Replace (legal text changes) | P1 |
| 404 title | `Page not found — StrengthCalc` | `Page not found — 1RMHub` | `src/pages/404.astro:8` | Replace | P1 |
| Share image | StrengthCalc wordmark | 1RMHub wordmark, same style and size (1200 × 630) | `public/og-image.png` | Replace | P1 |
| Share image alt text | StrengthCalc | 1RMHub | `Seo.astro:43` | Replace | P1 |
| Favicon label | `aria-label="StrengthCalc"` | `aria-label="1RMHub"` | `public/favicon.svg:1` | Replace | P2 |
| Logo, favicon ICO, Apple icon | Barbell only, no text | Same | `logo-512.png`, `favicon.ico`, `apple-touch-icon.png` | Keep | – |
| Contact email | `strengthcalc.team@outlook.com` | Decision D4 | `site.ts:12` | Your decision | P2 |

### B. Astro configuration

| Item | Current value | Target value | File/location | Action | Priority |
|---|---|---|---|---|---|
| `site` | `https://strengthcalc.pages.dev` | `https://1rmhub.com` | `astro.config.mjs:33` | Replace | P1 |
| Site comment | `Free Cloudflare Pages subdomain for launch` | Describes the custom domain | `astro.config.mjs:32` | Replace | P2 |
| Top comment | `StrengthCalc site configuration` | `1RMHub site configuration` | `astro.config.mjs:1` | Replace | P3 |
| Sitemap, trailing slash, build | Current settings | Same | `astro.config.mjs` | Keep | – |
| Environment variables | Only `PUBLIC_ADSENSE_CLIENT` used, and unset | Same | `src/config/ads.ts` | Keep | – |
| Test site constant | `https://strengthcalc.pages.dev` | `https://1rmhub.com` | `tests/site/dist.test.js:14` | Replace | P1 |

### C. SEO

| Item | Current value | Target value | File/location | Action | Priority |
|---|---|---|---|---|---|
| Canonical tags | Old host | New host | `BaseLayout.astro:32` | Automatic | P1 |
| XML sitemap | Old host | New host | `@astrojs/sitemap` | Automatic | P1 |
| robots.txt | Old host | New host | `robots.txt.ts` | Automatic | P1 |
| JSON-LD, breadcrumb, Article, WebApplication URLs | Old host | New host | `schema.ts` | Automatic | P1 |
| Open Graph and Twitter URLs | Old host | New host | `Seo.astro` | Automatic | P1 |
| `og:site_name`, WebSite and Organization names | StrengthCalc | 1RMHub | `SITE.name` | Automatic | P1 |
| App name, all lift pages | `StrengthCalc ${name}` | `1RMHub ${name}` | `ExerciseLayout.astro:35` | Replace | P1 |
| App names, tool pages | `StrengthCalc ...` | `1RMHub ...` | `1rm-percentage-calculator.astro:21`, `dots-calculator.astro:29`, `plate-calculator.astro:22`, `rpe-calculator.astro:26`, `warm-up-calculator.astro:19` | Replace | P1 |
| Internal links | Relative | Same | Whole site | Keep | – |
| External source links | Third-party URLs | Same | `src/data/sources.ts` | Keep | – |

### D. Functional website elements

| Item | Finding | Action | Priority |
|---|---|---|---|
| Navigation, footer, cross-links, breadcrumbs | Relative links | Keep | – |
| Share link | Built from `location.origin`, so it follows the current host | Keep, then test | P1 |
| Copy result link | Built from `location.origin` | Keep, then test | P1 |
| Old shared links (`?w=..&r=..&u=..`) | Work only if the redirect keeps the query string | Test in Stage 3 | P1 |
| Contact | Email link, no contact form | Keep | – |
| Error page | Title changes only | Replace | P1 |
| Saved unit and theme | Stored per address under `sc:prefs`, so visitors' settings reset once on the new domain | Keep; harmless | – |
| Calculator forms and formulas | Run in the browser; no change | Keep | – |

### E. Cloudflare

| Item | Current value | Target value | Location | Action | Priority |
|---|---|---|---|---|---|
| DNS zone | None known | `1rmhub.com`, Free plan | Cloudflare | Cloudflare dashboard | P1 |
| Parking records | A `2.57.91.91`, `www` CNAME | Removed if imported | Cloudflare DNS | Cloudflare dashboard | P1 |
| Custom domain | None known | `1rmhub.com` | Pages project | Cloudflare dashboard | P1 |
| `www` record | CNAME at Hostinger | A `www` → `192.0.2.1`, Proxied | Cloudflare DNS | Cloudflare dashboard | P1 |
| Bulk Redirect list and rule | None known | See [section 7](#7-cloudflare-migration-instructions) | Cloudflare | Cloudflare dashboard | P1 |
| Always Use HTTPS | Unknown | On | Zone SSL settings | Cloudflare dashboard | P1 |
| `_redirects` | `/sitemap.xml` rule | Same | `public/_redirects` | Keep | – |
| `_headers` | Not tied to a host | Same | `public/_headers` | Keep | – |
| Build settings | From README | Same | Pages settings | Keep | – |
| Project and `pages.dev` name | `strengthcalc` | Same | Pages project | Keep | – |
| Google verification file | Present | Same | `public/` | Keep | – |
| IndexNow key file | Present | Same | `public/` | Keep | – |

### F. External platforms

| Platform | Action | Who | Priority |
|---|---|---|---|
| Hostinger | Replace nameservers with the two Cloudflare gives you | You | P1 |
| Google Search Console | New Domain property, DNS verification, sitemap, Change of Address | You | P1 |
| Bing Webmaster Tools | Add and verify new site, submit sitemap | You | P1 |
| IndexNow | Run `npm run indexnow` after deployment | Me | P1 |
| Cloudflare Web Analytics | Confirm the new host is tracked | You | P2 |
| Google Analytics | Not used, so nothing to change | – | – |
| AdSense | Apply later with `1rmhub.com`; ads stay off | You | Later |
| GitHub profile and repo website | Update links and bio | You | P2 |
| Ahrefs | Add the new site if you still use it | You | P3 |
| Reddit, Quora and other posted links | Update where you can | You | P3 |

### G. Documentation and technical names

| Item | Current value | Target value | File/location | Action | Priority |
|---|---|---|---|---|---|
| README title and live site note | `# strengthcalc` | Add name and live URL | `README.md:1` | Replace | P2 |
| Package name | `strengthcalc` | Same | `package.json:11` | Keep | – |
| Package description | StrengthCalc | 1RMHub | `package.json:7` | Replace | P3 |
| GitHub repo | `Khuzaima628/strengthcalc` | Same | GitHub | Keep | – |
| Build warning prefix | `[StrengthCalc]` | `[1RMHub]` | `site.ts:52` | Replace | P3 |
| Code comments | StrengthCalc | 1RMHub | `index.astro:2`, `onerepmax.js:2`, `global.css:2`, `onerepmax.test.js:2` | Replace | P3 |
| Storage key | `sc:prefs` | Same (changing it has no benefit) | `BaseLayout.astro:48`, `prefs.js` | Keep | – |

### Classification of every "strengthcalc" mention

| Type | Where | Rule |
|---|---|---|
| Production URL | `astro.config.mjs:33`, `dist.test.js:14` | Replace |
| Public branding | Pages, components, guides, layouts, data, `site.ts`, share image | Replace |
| Technical identifier | Package name, repo, Cloudflare project, `pages.dev` name | Keep |
| Contact identity | `strengthcalc.team@outlook.com` | Decision D4 |
| Internal comments | Astro config, engine, CSS, tests | Optional |
| Documentation | `README.md`, this plan | Update README; this plan keeps old names as history |
| Historical reference | About page note, if approved | Add on purpose |

---

## 6. Full old-to-new URL mapping

Source: the live sitemap and `tests/site/dist.test.js`. All 22 are indexable pages. No path changes.

| # | Old URL | New URL | Redirect required | Notes |
|---|---|---|---|---|
| 1 | https://strengthcalc.pages.dev/ | https://1rmhub.com/ | Yes | Homepage |
| 2 | https://strengthcalc.pages.dev/1rm-percentage-calculator/ | https://1rmhub.com/1rm-percentage-calculator/ | Yes | Same path |
| 3 | https://strengthcalc.pages.dev/about/ | https://1rmhub.com/about/ | Yes | Same path |
| 4 | https://strengthcalc.pages.dev/barbell-row-calculator/ | https://1rmhub.com/barbell-row-calculator/ | Yes | Same path |
| 5 | https://strengthcalc.pages.dev/bench-press-calculator/ | https://1rmhub.com/bench-press-calculator/ | Yes | Same path |
| 6 | https://strengthcalc.pages.dev/contact/ | https://1rmhub.com/contact/ | Yes | Same path |
| 7 | https://strengthcalc.pages.dev/deadlift-calculator/ | https://1rmhub.com/deadlift-calculator/ | Yes | Same path |
| 8 | https://strengthcalc.pages.dev/disclaimer/ | https://1rmhub.com/disclaimer/ | Yes | Same path |
| 9 | https://strengthcalc.pages.dev/dots-calculator/ | https://1rmhub.com/dots-calculator/ | Yes | Same path |
| 10 | https://strengthcalc.pages.dev/guides/ | https://1rmhub.com/guides/ | Yes | Same path |
| 11 | https://strengthcalc.pages.dev/guides/1rm-formulas/ | https://1rmhub.com/guides/1rm-formulas/ | Yes | Same path; seen on Google |
| 12 | https://strengthcalc.pages.dev/guides/how-to-test-1rm/ | https://1rmhub.com/guides/how-to-test-1rm/ | Yes | Same path |
| 13 | https://strengthcalc.pages.dev/guides/training-max/ | https://1rmhub.com/guides/training-max/ | Yes | Same path |
| 14 | https://strengthcalc.pages.dev/guides/what-is-1rm/ | https://1rmhub.com/guides/what-is-1rm/ | Yes | Same path |
| 15 | https://strengthcalc.pages.dev/methodology/ | https://1rmhub.com/methodology/ | Yes | Same path; seen on Google |
| 16 | https://strengthcalc.pages.dev/overhead-press-calculator/ | https://1rmhub.com/overhead-press-calculator/ | Yes | Same path |
| 17 | https://strengthcalc.pages.dev/plate-calculator/ | https://1rmhub.com/plate-calculator/ | Yes | Same path |
| 18 | https://strengthcalc.pages.dev/privacy/ | https://1rmhub.com/privacy/ | Yes | Same path |
| 19 | https://strengthcalc.pages.dev/rpe-calculator/ | https://1rmhub.com/rpe-calculator/ | Yes | Same path |
| 20 | https://strengthcalc.pages.dev/squat-calculator/ | https://1rmhub.com/squat-calculator/ | Yes | Same path; seen on Google |
| 21 | https://strengthcalc.pages.dev/terms/ | https://1rmhub.com/terms/ | Yes | Same path |
| 22 | https://strengthcalc.pages.dev/warm-up-calculator/ | https://1rmhub.com/warm-up-calculator/ | Yes | Same path |

**Other paths to test**

| Old path | Expected after redirect | Note |
|---|---|---|
| `/?w=225&r=5&u=lb&e=bench&f=epley` | `https://1rmhub.com/?w=225&r=5&u=lb&e=bench&f=epley` | Query kept; example values only |
| `/bench-press-calculator` (no slash) | Reaches `https://1rmhub.com/bench-press-calculator/` | **INFERRED** 2 hops: Bulk Redirect, then Pages' slash redirect. Acceptable, because nothing links to this form |
| `/sitemap.xml` | Redirects to the new domain | Expected |
| `/robots.txt` | Redirects to the new domain | Expected |
| `/google9f1b21d879660ecb.html` | Redirects to the new domain | Causes the verification risk, R5 |
| `/807576ada176516cddbb74850c38e78b.txt` | Redirects to the new domain | New host serves the same key |

**Questions from the brief**

| Question | Answer | Status |
|---|---|---|
| Can all paths be preserved? | Yes. Paths don't depend on the domain | VERIFIED |
| Can query strings be preserved? | Yes, with **Preserve query string** | VERIFIED |
| Redirect chains? | None for the 22 canonical URLs if Stage 3 is correct | Test in Stage 3 |
| Redirect loops? | No rule points back to the old host; test before and after | Test in Stage 3 |
| Duplicate old and new sites? | Prevented by redirect and canonical links | Decision D1 |
| Can `pages.dev` redirect reliably? | Yes. Bulk Redirects is the documented method | VERIFIED |

---

## 7. Cloudflare migration instructions

All steps are from Cloudflare's current docs. Dashboard labels can differ slightly, so send a screenshot if something does not match.

### 7.1 Add the domain

1. **Domains → Onboard a domain**, enter `1rmhub.com`, and continue.
2. Choose the **Free** plan.
3. **Review DNS records.** Cloudflare's scan may import Hostinger's parking records.
4. **Delete the parking records if imported:** A `2.57.91.91` and the `www` CNAME. **INFERRED:** they conflict with the records Pages needs, and we use no other service on this domain. There are no MX or TXT records to keep.
5. Copy the **two nameservers** Cloudflare shows. They are assigned to your account and cannot be chosen.

### 7.2 Change nameservers at Hostinger

1. Hostinger → **Domains → `1rmhub.com`** → DNS / Nameservers.
2. Replace `atlas.dns-parking.com` and `hyperion.dns-parking.com` with Cloudflare's two.
3. Wait until Cloudflare shows the domain as active. Timing varies; it can take hours.

DNSSEC is not on, so it needs no action. Keep the old nameserver values above for rollback.

### 7.3 Connect the domain to Pages

1. **Workers & Pages → your project → Custom domains → Set up a domain**.
2. Enter `1rmhub.com` and continue.
3. Wait for **Active**. Cloudflare creates the CNAME record and issues the certificate.

**Don't add a manual CNAME before this step.** Cloudflare warns that doing so causes a `522` error.

### 7.4 Set up `www` and HTTPS

1. **Bulk Redirects:** create a list with:

| Source URL | Target URL | Status | Parameters |
|---|---|---|---|
| `www.1rmhub.com` | `https://1rmhub.com` | 301 | Preserve query string, Subpath matching, Preserve path suffix, Include subdomains |

2. Create a Bulk Redirect rule that uses the list.
3. **DNS:** add `A`, name `www`, IPv4 `192.0.2.1`, **Proxied**. This is Cloudflare's documented placeholder; proxying makes the redirect run.
4. **SSL/TLS:** turn on **Always Use HTTPS**.

**Don't change these for now:**
- **HSTS:** it's hard to undo.
- **SSL/TLS mode:** no doc requires a change for Pages.

### 7.5 Redirect the old address (Decision D1, Stage 3 only)

| Source URL | Target URL | Status | Parameters |
|---|---|---|---|
| `strengthcalc.pages.dev` | `https://1rmhub.com` | 301 | Preserve query string, Subpath matching, Preserve path suffix |

Cloudflare's example also turns on **Include subdomains**. I recommend leaving it **off** at first (Decision D3). **INFERRED:** with it on, the rule would also catch `*.strengthcalc.pages.dev`, including preview deployments we may need for testing or rollback.

Free plan limits are enough: 15 rules, 5 lists and 10,000 URL redirects.

### What cannot be used

| Method | Why not |
|---|---|
| `public/_redirects` | Domain-level redirects are not supported |
| Deleting the project | Breaks old links; never do this |
| Pages Function with a host check | Possible, but all requests would then count toward the 100,000/day free limit, with Error 1027 beyond it. Avoid unless the verification problem makes it necessary |

---

## 8. Exact DNS requirements

| Name | Type | Value | Proxy | Created by | Status |
|---|---|---|---|---|---|
| `1rmhub.com` | CNAME | The project's `.pages.dev` hostname | Set by Cloudflare | Automatically, by Custom domains | VERIFIED |
| `www` | A | `192.0.2.1` | Proxied | You | VERIFIED |
| `1rmhub.com` | TXT | The value Google gives you | DNS only | You | Value known at Stage 5 |
| Nameservers | NS | The 2 assigned by Cloudflare | – | You, at Hostinger | Values known at Stage 2 |

**Don't add** the old parking A record, any MX record, or any CAA record. Nothing here needs them.

---

## 9. SEO migration instructions

| Requirement | Reason | Our action | Source |
|---|---|---|---|
| Keep the same site structure | Passes signals more directly | No path changes, no redesign | [Change of Address](https://support.google.com/webmasters/answer/9370220?hl=en) |
| 301 from old to new | Strong canonical signal; the tool checks for 301s | Bulk Redirect | [Canonical methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) |
| Canonical links on the new host | Strong signal | Automatic from `site` | Same |
| New sitemap | Weak signal, helps discovery | Automatic; submit in Stage 5 | Same |
| New robots.txt | Must not block pages | Automatic; test | [Site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) |
| Update structured data | Must describe the real site | Automatic plus code | [Site names](https://developers.google.com/search/docs/appearance/site-names) |
| Consistent name on the homepage | Helps Google choose the site name | `1RMHub` in data, title and header | Same |
| Add `alternateName` | Gives Google a backup name | `1rmhub.com`, automatic | Same |
| Keep redirects long enough | Google: at least 180 days in Help; generally a year in developer docs | Keep for at least 1 year | Both linked above |
| Expect temporary changes | Google warns of ranking fluctuation; medium sites can take a few weeks or more | Monitor; don't react daily | [Site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) |
| Don't chain moves | The tool blocks a further immediate move | Stay on `1rmhub.com` | [Change of Address](https://support.google.com/webmasters/answer/9370220?hl=en) |

**Backlinks:** update the few you control, such as GitHub. Redirects cover the rest.

---

## 10. Google Search Console steps

Use the **same Google account** for the old and new properties. Google requires this for Change of Address.

1. **Add property → Domain →** `1rmhub.com`. A Domain property covers `www`, the main domain, and `http` and `https`.
2. **Verify with DNS.** This is the only way to verify a Domain property. Google shows a TXT value; add it in Cloudflare DNS. Google may offer an automatic flow. **UNVERIFIED** for your account, but the manual TXT record always applies.
3. **Sitemaps →** submit `https://1rmhub.com/sitemap-index.xml`.
4. **URL Inspection →** test the homepage and a few pages. Use **Request indexing** only for key pages, and stop if the quota is reached.
5. **Keep the old property.** Don't remove it at this stage.
6. **After the redirect is live:** old property → **Settings → Change of Address** → choose the new site.
   - **Fits the docs:** Google says the tool works for sites such as `m.example.com`, so `strengthcalc.pages.dev` should qualify.
   - **UNVERIFIED:** whether the tool accepts this `pages.dev` property. If it refuses, send a screenshot. Redirects and canonical links still do the main job.
7. **After a successful request:** Google shows the notice for 180 days. You can cancel during that time.

**Verification warning:** Google checks tokens periodically. It won't follow a verification-file redirect to another domain. If the check fails, you are notified, and access ends after a grace period of unstated length. Google recommends an HTML tag when redirecting all traffic, but that tag is on pages that would also redirect, so it may not help. **So do step 6 the same day, and export old performance data first.**

**UNVERIFIED:** whether losing old-property access later affects a Change of Address already submitted. The docs do not say.

**Monitor:** Pages report, Sitemaps, Performance and Crawl stats. Weekly checks for at least 180 days.

---

## 11. Bing and IndexNow steps

### Bing Webmaster Tools

1. **Add site:** `https://1rmhub.com/`.
2. **Verify using one method:**
   - **Import from Google Search Console:** adds and verifies verified properties, and imports sitemaps. Bing keeps checking ownership through that link.
   - **CNAME in Cloudflare DNS, or DNS auto-verification (Domain Connect):** no code change.
   - **Meta tag or `BingSiteAuth.xml`:** needs a code change.
3. **Recommended:** import after the Google property is verified. Use CNAME if the import doesn't work.
4. **Sitemaps:** confirm or submit `https://1rmhub.com/sitemap-index.xml`.
5. **Old site:** keep it until the new one is showing, then remove it (Decision D6).

**Bing Site Move tool: UNVERIFIED.** Bing's help pages could not be read by my tools, and forum posts conflict on whether the tool still exists. If you see it in your dashboard, send a screenshot. If not, 301 redirects and the new sitemap are what we have.

### IndexNow

| Question | Answer | Status |
|---|---|---|
| Does the key need to change? | No. The key is proven by the key file on the host | VERIFIED |
| Does the key file need to move? | It's in `public/`, so it deploys to the new host automatically | VERIFIED |
| Does `scripts/indexnow.mjs` need editing? | No. It reads `site` and checks the key file before sending | VERIFIED |
| When do we run it? | After the new site is live: `npm run indexnow` | – |
| Do we keep sending the old URLs? | No. The script sends only the new host | VERIFIED |

---

## 12. AdSense considerations

**Rule: ads stay off. Nothing here happens without your approval.**

| Topic | Finding | Action |
|---|---|---|
| Current state | Switch off, `/ads.txt` returns 404. From your earlier messages, you have not applied | Please confirm (Question Q5) |
| Site to apply with | Use `1rmhub.com`, after the move has settled | Later |
| If you already have an account | Add the new site in the Sites list; Google reviews it | Later |
| Review time | Usually a few days; sometimes 2–4 weeks | Plan for it |
| `ads.txt` | Optional but highly recommended. Set `PUBLIC_ADSENSE_CLIENT` and the site publishes it | Later |
| Privacy Policy | Must explain Google's advertising cookies and how to opt out. `privacy.astro` already switches on these sections | Review after enabling |
| Consent | A Google-certified consent platform (CMP) is required for personalised ads in the EEA, UK and Switzerland | Set up before enabling ads |
| Eligibility | Original, quality content; applicant at least 18; HTML access | Your check |

**Before enabling ads:**
- [ ] Your approval
- [ ] New domain stable
- [ ] AdSense has approved the site
- [ ] Consent message configured
- [ ] `SITE.policyDate` updated
- [ ] Privacy, About and Disclaimer pages reviewed in ads mode
- [ ] `/ads.txt` shows your own publisher ID
- [ ] All tests pass

---

## 13. Ordered implementation roadmap

**One change to the brief's order:** Stage 1 is **prepared on a branch and tested locally**, but it goes live only at the end of Stage 2. A push to `main` deploys straight away, and canonical links must not point to a domain that does not work yet.

**Stage 4 runs in two parts:** 4A before the old-address redirect, and 4B after it.

---

### Stage 0: Backup and preparation

**Approval required before starting: Yes**

1. **Actions**
   - [ ] Confirm `main` is clean and matches GitHub.
   - [ ] Create a tag and a branch.
   - [ ] Run `npm run verify`.
   - [ ] Save the sitemap and the current URL list.
   - [ ] You export Search Console Performance and Pages data.
   - [ ] You take screenshots of Bing and Cloudflare Web Analytics.
2. **Files changed:** none. `dist/` is ignored by Git.
3. **Values:** tag `pre-1rmhub-migration`; branch `migration/1rmhub`.
4. **Your dashboard actions:** exports and screenshots, plus the [items in section 17](#items-i-need-from-you).
5. **Commands**
   ```bash
   git status --short
   git fetch origin
   git tag pre-1rmhub-migration
   git push origin pre-1rmhub-migration
   git switch -c migration/1rmhub
   npm run verify
   ```
6. **Expected result:** 95 unit tests and 27 site tests pass; the tag exists on GitHub.
7. **Verification:** `git ls-remote --tags origin pre-1rmhub-migration`.
8. **Failure conditions:** tests fail, the tree isn't clean, or the tag doesn't push.
9. **Rollback:** delete the tag and branch. The site is not affected.
10. **Approval to continue:** Yes.

---

### Stage 1: Brand and code changes (branch only)

**Approval required before starting: Yes, plus Decisions D2, D4 and D5**

1. **Actions**
   - [ ] Change `site` and the test constant.
   - [ ] Change `SITE.name`, the header and all items in [section 5](#5-complete-change-inventory).
   - [ ] Regenerate `og-image.png` with the same layout.
   - [ ] Update `SITE.policyDate` and the README.
   - [ ] Add the About note, if approved.
   - [ ] Run the full tests.
   - [ ] Review the diff together.
2. **Files changed:** those listed in section 5, mainly `astro.config.mjs`, `src/config/site.ts`, `Header.astro`, `Seo.astro`, `src/pages/*`, guides, `public/og-image.png`, `public/favicon.svg`, `tests/site/dist.test.js`, `README.md`.
3. **Values:** `site: 'https://1rmhub.com'`; `name: '1RMHub'`; wordmark `1RM<span>Hub</span>`.
4. **Your dashboard actions:** none.
5. **Commands**
   ```bash
   npm run verify
   git grep -n -I -i "strengthcalc" -- . ':!package-lock.json' ':!DOMAIN_MIGRATION_PLAN.md'
   ```
6. **Expected result:** all tests pass. Remaining mentions are only those approved to keep.
7. **Verification**
   - Built pages use `https://1rmhub.com` in canonical, Open Graph, JSON-LD, sitemap and robots.txt.
   - Title and description limits still pass.
   - A visual check of the header, footer and share image.
8. **Failure conditions:** old host in `dist/`, test failures, or calculator results changing.
9. **Rollback:** discard the branch. Nothing is live.
10. **Approval to continue:** Yes.

---

### Stage 2: Cloudflare domain configuration

**Approval required before starting: Yes**

1. **Actions**
   - [ ] Add the zone ([7.1](#71-add-the-domain)).
   - [ ] Change nameservers ([7.2](#72-change-nameservers-at-hostinger)).
   - [ ] Wait for the zone to be active.
   - [ ] Add the custom domain ([7.3](#73-connect-the-domain-to-pages)).
   - [ ] Wait for **Active**.
   - [ ] Set up `www` and Always Use HTTPS ([7.4](#74-set-up-www-and-https)).
   - [ ] Test the domain.
   - [ ] Merge Stage 1 to `main` after your approval.
2. **Files changed:** none in this stage; the Stage 1 merge deploys its files.
3. **Values:** see [section 8](#8-exact-dns-requirements).
4. **Your dashboard actions:** all Cloudflare and Hostinger steps above.
5. **Commands**
   ```bash
   curl -sI https://1rmhub.com/
   curl -sI http://1rmhub.com/
   curl -sI https://www.1rmhub.com/bench-press-calculator/?x=1
   ```
6. **Expected result**
   - `https://1rmhub.com/` returns 200 from Cloudflare.
   - `http://` redirects to `https://`.
   - `www` returns 301 to `https://1rmhub.com/bench-press-calculator/?x=1`.
7. **Verification:** valid certificate in a browser; the parking page is gone; the old address still works.
8. **Failure conditions:** domain stuck on Verifying, `522`, SSL errors, or the old parking IP still resolving after a long wait.
9. **Rollback**
   - Remove the custom domain using Cloudflare's steps (DNS record first, then **Remove domain**).
   - If needed, restore `atlas.dns-parking.com` and `hyperion.dns-parking.com` at Hostinger.
   - The old address keeps working throughout.
10. **Approval to continue:** Yes, including a separate approval for the merge to `main`.

---

### Stage 3: Redirect configuration

**Approval required before starting: Yes. Decisions D1 and D3 needed, and Stage 4A must pass first.**

1. **Actions**
   - [ ] You export old Search Console data again.
   - [ ] Create the list and rule ([7.5](#75-redirect-the-old-address-decision-d1-stage-3-only)).
   - [ ] Test all 22 URLs.
   - [ ] Test query strings, no-slash paths, chains and loops.
   - [ ] Go straight to Stage 5 for Change of Address.
2. **Files changed:** none.
3. **Values:** see 7.5.
4. **Your dashboard actions:** create the list and rule.
5. **Commands**
   ```bash
   for u in $(curl -s https://1rmhub.com/sitemap-0.xml | grep -oE "<loc>[^<]*" | sed 's/<loc>//'); do
     old="https://strengthcalc.pages.dev${u#https://1rmhub.com}"
     printf "%s -> " "$old"
     curl -s -o /dev/null -w "%{http_code} %{redirect_url} | final %{url_effective} %{http_code} hops=%{num_redirects}\n" -L "$old"
   done
   curl -sIL "https://strengthcalc.pages.dev/?w=225&r=5&u=lb&e=bench&f=epley"
   curl -sIL "https://strengthcalc.pages.dev/bench-press-calculator"
   ```
6. **Expected result**
   - Each of the 22 URLs reaches its exact new URL in **1 hop**, ending in 200.
   - Query strings are kept.
   - The no-slash URL reaches the slash URL in 2 hops or fewer.
7. **Verification:** also test in a private browser window, and test a real shared calculator link.
8. **Failure conditions:** 404s, wrong path, lost query string, loops, or any 522 or SSL error.
9. **Rollback:** disable or delete the Bulk Redirect rule. The old address serves pages again.
10. **Approval to continue:** Yes.

---

### Stage 4: Production testing

**Approval required before starting: No (read-only). Results are reviewed together.**

**4A runs before the redirect. 4B runs after it.**

1. **Actions (4A: new domain)**
   - [ ] Run `npm run verify`.
   - [ ] Check all 22 pages return 200.
   - [ ] Test all 11 calculator pages and the training max calculator in the guide in a real browser, comparing results with the old site.
   - [ ] Test Share, Copy and Print.
   - [ ] Test light and dark mode.
   - [ ] Test mobile width.
   - [ ] Check the canonical tag on every page.
   - [ ] Validate the sitemap and robots.txt.
   - [ ] Run Google's Rich Results Test on a few pages.
   - [ ] Test the 404 page.
   - [ ] Scan pages for the old name and old host.

   **Actions (4B: after the redirect)**
   - [ ] Repeat the redirect tests.
   - [ ] Check the old address no longer serves pages.
2. **Files changed:** none. Any fix goes through a new approval.
3. **Values:** see [section 14](#14-verification-checklist).
4. **Your dashboard actions:** a phone test, and Rich Results Test if you prefer to run it.
5. **Commands**
   ```bash
   npm run verify
   curl -s https://1rmhub.com/robots.txt
   curl -s https://1rmhub.com/sitemap-index.xml
   curl -s https://1rmhub.com/ | grep -i -c "strengthcalc"
   ```
6. **Expected result:** everything in section 14 passes, and the old-name count is 0 except approved mentions.
7. **Verification:** I report results per item. I won't call anything done on the happy path alone.
8. **Failure conditions:** any calculator mismatch, wrong canonical, broken page, or invalid schema.
9. **Rollback:** fix forward if small. If serious, revert the merge (see [section 16](#16-rollback-plan)).
10. **Approval to continue:** Yes.

---

### Stage 5: Search engine migration

**Approval required before starting: Yes**

1. **Actions**
   - [ ] Verify the new Google property.
   - [ ] Submit the sitemap.
   - [ ] Run Change of Address on the same day as the redirect.
   - [ ] Add and verify Bing.
   - [ ] Confirm the Bing sitemap.
   - [ ] Run IndexNow.
   - [ ] Inspect key pages.
   - [ ] Update your GitHub links.
2. **Files changed:** none, unless Bing needs a meta tag or XML file.
3. **Values:** sitemap `https://1rmhub.com/sitemap-index.xml`.
4. **Your dashboard actions:** sections 10 and 11.
5. **Commands**
   ```bash
   npm run indexnow
   ```
6. **Expected result:** `HTTP 200` or `202` for 22 URLs; Google accepts the property and sitemap. New-site sitemaps may show "Couldn't fetch" for a while, as the old one did.
7. **Verification:** URL Inspection → **Test live URL** shows the page can be indexed.
8. **Failure conditions:** DNS verification fails, Change of Address fails a critical check, or IndexNow returns an error.
9. **Rollback:** cancel Change of Address within 180 days using Google's steps (see section 16). Removing a property doesn't affect the site.
10. **Approval to continue:** Yes.

---

### Stage 6: Analytics and AdSense

**Approval required before starting: Yes. Ads are never enabled without separate approval.**

1. **Actions**
   - [ ] Check that the beacon is on `1rmhub.com`.
   - [ ] Confirm visits show in Web Analytics.
   - [ ] If not, add the hostname under **Web Analytics → Add a site**.
   - [ ] Review section 12. Don't enable ads.
2. **Files changed:** none.
3. **Values:** no token goes in the repo; Cloudflare injects the beacon.
4. **Your dashboard actions:** check Web Analytics.
5. **Commands**
   ```bash
   curl -s https://1rmhub.com/ | grep -c cloudflareinsights
   curl -s -o /dev/null -w "%{http_code}\n" https://1rmhub.com/ads.txt
   ```
6. **Expected result:** the beacon is present; `/ads.txt` returns 404 while ads are off.
7. **Verification:** your own visit appears in Web Analytics, after a short delay.
8. **Failure conditions:** no beacon or no data.
9. **Rollback:** no site impact. The Privacy page already names Cloudflare Web Analytics, so don't remove analytics without updating it.
10. **Approval to continue:** Yes.

---

### Stage 7: Post-migration monitoring

**Approval required before starting: No, but removing anything needs approval.**

1. **Actions**

   | When | Check |
   |---|---|
   | Days 1, 3 and 7 | Redirects, sample pages, sitemap status |
   | Weekly | Pages, Performance, Crawl stats, Bing, Web Analytics |
   | Week 4 | Compare with the baseline; check the name shown in Google |
   | Day 180 | Review Change of Address and old-URL traffic |
   | 1 year or more | Keep the redirect; renew the domain before 2027-11-06 |

2. **Files changed:** none, unless we fix something.
3. **Values:** baseline from Stage 0.
4. **Your dashboard actions:** weekly screenshots and domain auto-renew.
5. **Commands:** the Stage 3 loop on the first checks.
6. **Expected result:** old URLs gradually replaced by new ones. Google warns rankings may fluctuate during this time.
7. **Verification:** "Indexed" grows on the new property; no rise in 404s.
8. **Failure conditions:** rising 404s, new pages not indexed after several weeks, a sitemap that keeps failing even though Test live URL succeeds, or a lasting traffic drop.
9. **Rollback:** see section 16.
10. **Approval to continue:** Required before removing the old property, redirect or project.

---

## 14. Verification checklist

### Domain and security
- [ ] `1rmhub.com` uses Cloudflare nameservers
- [ ] Custom domain shows **Active**
- [ ] Valid HTTPS certificate on the main domain
- [ ] `http://1rmhub.com/` redirects to `https://1rmhub.com/`
- [ ] `www.1rmhub.com` redirects with path and query kept
- [ ] No redirect loop on any host

### Redirects
- [ ] All 22 old URLs reach their exact new URL
- [ ] Query string kept on a real shared link
- [ ] No canonical URL needs more than 1 hop

### SEO on all 22 pages
- [ ] Each canonical is `https://1rmhub.com` plus its own path
- [ ] `og:url`, `og:image`, `og:site_name` and Twitter tags are correct
- [ ] JSON-LD parses and uses the new host
- [ ] Breadcrumb URLs use the new host
- [ ] Sitemap lists exactly 22 new URLs, and all return 200
- [ ] robots.txt allows crawling and points to the new sitemap
- [ ] 404 page returns 404 and is `noindex`
- [ ] Rich Results Test shows no new errors

### Brand
- [ ] Header, footer, titles and legal pages show 1RMHub
- [ ] Share image shows 1RMHub
- [ ] Copied and printed results show 1RMHub
- [ ] Old name appears only where approved

### Function
- [ ] All 11 calculator pages and the training max calculator give the same results as before
- [ ] Unit toggle and theme work
- [ ] Share, Copy and Print work
- [ ] Mobile layout has no overflow
- [ ] `npm run verify` passes

### External
- [ ] Google property verified, sitemap submitted
- [ ] Change of Address submitted, or its refusal recorded
- [ ] Bing verified, sitemap accepted
- [ ] IndexNow returned 200 or 202
- [ ] Web Analytics shows the new domain
- [ ] GitHub links updated
- [ ] Ads remain off

---

## 15. Risk register

| Risk | Probability | Impact | Prevention | Recovery |
|---|---|---|---|---|
| **R1. Losing Google rankings** | Medium, short term | Low now (little traffic) | Same paths, 301, canonical, Change of Address | Monitor; check for technical errors; don't chain moves |
| **R2. Old URLs become 404** | Low | High | Don't delete the project; test all 22 | Fix or disable the rule |
| **R3. Wrong canonical URLs** | Low | High | Single `site` value; tests; Stage 4 | Fix config, redeploy, resubmit |
| **R4. Duplicate old and new sites** | Medium without a redirect | Medium | Redirect plus canonical | Enable the redirect if chosen later |
| **R5. Old Search Console access lapses** | Medium to high with redirect | Low to medium | Export first; do Change of Address the same day | New property keeps working; access to old data may be lost |
| **R6. Redirect loop** | Low | High | One-way rules; test | Disable the rule |
| **R7. SSL certificate error** | Low | High | No CAA records; wait for Active; leave SSL mode alone | Check Custom domains; re-add per Cloudflare's docs |
| **R8. Cloudflare DNS mistake** | Medium | High for the new domain only | Delete parking records; follow section 8; no manual CNAME | Correct the record; old address still works before the redirect |
| **R9. Broken sitemap** | Low | Medium | Tests; fetch checks | Fix and resubmit; use Test live URL |
| **R10. robots.txt blocks pages** | Very low | High | Generated `Allow: /`; test | Fix and redeploy |
| **R11. Search Console verification fails** | Low | Medium | Add the exact TXT value; allow time | Recheck record; retry |
| **R12. Change of Address refused** | Unknown | Low | Meet requirements; same account | Rely on redirects and canonical links; record the message |
| **R13. AdSense problems** | Low now | Medium later | Ads off; apply after settling; consent setup | Follow Google's review message |
| **R14. Calculator breakage** | Very low | High | No calculator logic changes; tests; browser test | Revert the commit |
| **R15. Wrong or mixed branding** | Medium | Low | `git grep` scan; visual review; share image update | Fix and redeploy |
| **R16. Code goes live too early** | Low | High | Branch-only until Active; separate merge approval | Revert the merge |
| **R17. Domain expires** | Low | Very high | Auto-renew; reminder before 2027-11-06 | Renew immediately |
| **R18. Name confusion** | Low | Low | Unique name checks; About note | No action unless reported |
| **R19. Trademark issue** | Low, not fully checked | Medium | You finish USPTO checks for `1RM HUB` and `1RMHUB` | Seek advice if a conflict appears |
| **R20. Preview deployments reachable** | Low | Low | Decide D3 | Turn on Include subdomains |

---

## 16. Rollback plan

**The rule:** the old site stays available until the new domain has passed Stage 4A. The tag `pre-1rmhub-migration` is the safe code point.

| Situation | What to do |
|---|---|
| New domain doesn't activate | Stop. Code isn't live and the old site is unaffected. Fix DNS or remove the custom domain |
| Code problem after merge | `git revert` the merge commit on `main`, push after approval, and check the live site |
| Redirect problem | Disable or delete the Bulk Redirect rule. The old host serves pages again |
| Need to go fully back | 1. Cancel Change of Address. 2. Disable the old-address redirect. 3. Revert the code. 4. Run IndexNow for the old host. 5. Remove the custom domain. 6. Restore the parking nameservers only if needed |
| Change of Address cancellation | Within 180 days: remove old 301s, add 301s from new to old, then click **Cancel Move** in the old property |

**Never in a rollback:**
- Don't delete the Cloudflare project.
- Don't delete `public/google9f1b21d879660ecb.html` or the IndexNow key file.
- Don't force-push `main`.
- Don't use Google's Removals tool.

---

## 17. Open questions and items requiring your action

### Decisions needing your approval

| # | Decision | My recommendation | Your answer |
|---|---|---|---|
| **D1** | Redirect the old address to the new domain? | **Yes.** It's Google's strongest signal and Change of Address needs it. Without it, old and new stay live as duplicates and only canonical links guide Google | |
| **D2** | Name shown publicly: `1RMHub` or `1RM Hub`? | `1RMHub`, as in your brief. It matches the domain | |
| **D3** | Include subdomains on the old-address redirect? | Off for now, on later if needed | |
| **D4** | Contact email | Keep `strengthcalc.team@outlook.com` until you create a new one. It still works, but shows the old name | |
| **D5** | Add "previously called StrengthCalc" to the About page? | Yes. It's honest and helps returning visitors | |
| **D6** | When to remove old Google and Bing properties | Not during migration. Keep Google for at least 180 days | |
| **D7** | When to publish the RPE guide | After Stage 5, to keep the move simple. If first, it joins the URL table as 23rd | |

### Questions

| # | Question |
|---|---|
| **Q1** | Is your Cloudflare Pages project named `strengthcalc`? |
| **Q2** | Is `1rmhub.com` already added to your Cloudflare account? |
| **Q3** | Is the same Google account used for your Search Console property? It must own both old and new |
| **Q4** | Did the USPTO search for `1RM HUB` and `1RMHUB` show no results? |
| **Q5** | Have you applied for AdSense or added any site there? |
| **Q6** | Do you have other services using `1rmhub.com`, such as Hostinger email? DNS currently shows none |
| **Q7** | Do you want to keep using Cloudflare Web Analytics? |

### Items I need from you

| Screenshot | Why |
|---|---|
| **Pages project → Custom domains** | See the current state and project name |
| **Pages project → Settings → Build** (build command, output, variables) | Confirm the README is right; hide any secret values |
| **Pages project → Metrics → Web Analytics** | Confirm how analytics is set up |
| **Hostinger → Domains → `1rmhub.com` → DNS / Nameservers** | Confirm where to change them |
| **Search Console → Settings** (old property) | Confirm owner and verification method |
| **Bing → Sitemaps or Site settings** | Check for a Site Move option |

**Only you can do:** Cloudflare, Hostinger, Google, Bing, GitHub profile, and AdSense actions.

---

## 18. Official reference links

**Cloudflare**
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Redirecting `*.pages.dev` to a custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)
- [Redirecting `www` to the apex domain](https://developers.cloudflare.com/pages/how-to/www-redirect/)
- [Pages `_redirects` file](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Pages known issues](https://developers.cloudflare.com/pages/platform/known-issues/)
- [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/)
- [Bulk Redirect parameters](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/)
- [Redirect availability and quotas](https://developers.cloudflare.com/rules/url-forwarding/)
- [Primary (full) DNS setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Web Analytics get started](https://developers.cloudflare.com/web-analytics/get-started/)

**Google Search**
- [Change of Address tool](https://support.google.com/webmasters/answer/9370220?hl=en)
- [Site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Canonical methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Verify site ownership](https://support.google.com/webmasters/answer/9008080?hl=en)
- [Add a website property](https://support.google.com/webmasters/answer/34592?hl=en)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)

**Google AdSense**
- [Add a new site](https://support.google.com/adsense/answer/12169212?hl=en)
- [Connect your site](https://support.google.com/adsense/answer/7584263?hl=en)
- [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en)
- [Required content (privacy)](https://support.google.com/adsense/answer/1348695?hl=en)
- [Consent requirements for EEA, UK and Switzerland](https://support.google.com/adsense/answer/13554116?hl=en)
- [Eligibility requirements](https://support.google.com/adsense/answer/9724?hl=en)
- [Program policies](https://support.google.com/adsense/answer/48182?hl=en)

**Bing and IndexNow**
- [Bing: Add and verify a site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b) (seen through search results only)
- [Bing: Import from Search Console](https://blogs.bing.com/webmaster/2019/9/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools/)
- [Bing Site Move discussion](https://techcommunity.microsoft.com/discussions/bing/domain-move-tool/2144750) (community, not official)
- [IndexNow documentation](https://www.indexnow.org/documentation)
- [IndexNow FAQ](https://www.indexnow.org/faq)

**Astro**
- [Configuration reference](https://docs.astro.build/en/reference/configuration-reference/) (my fetch could not extract the `site` section; this repo's own build and tests confirm how `site` is used)

### What I could not verify

| Item | How we settle it |
|---|---|
| Change of Address accepting a `pages.dev` property | Try it in Stage 5 |
| Length of the verification grace period | Google doesn't state it |
| Effect of lost old-property access on a submitted move | Docs are silent; act same day and export data first |
| Bing Site Move tool status | Your dashboard screenshot |
| Your exact Cloudflare and Hostinger screens | Your screenshots |
| Whether preview deployments are on for this project | Your screenshot, or Stage 1 |
| Trademark status | Your USPTO checks; not legal advice |

---

## 19. Final completion checklist

### Done before this plan
- [x] Domain `1rmhub.com` bought at Hostinger (registry confirmed 2026-11-06)
- [x] Research and this plan written

### Migration
- [ ] Decisions D1–D7 answered
- [ ] Questions and screenshots received
- [ ] Stage 0: Backup and preparation
- [ ] Stage 1: Brand and code changes on a branch
- [ ] Stage 2: Domain connected and Active
- [ ] Stage 2: Code merged after approval
- [ ] Stage 4A: New domain tested
- [ ] Stage 3: Old-address redirect tested
- [ ] Stage 4B: Redirect tested after going live
- [ ] Stage 5: Google, Bing and IndexNow done
- [ ] Stage 6: Analytics confirmed; ads still off
- [ ] Stage 7: Monitoring started

### Closing checks
- [ ] 180-day review completed
- [ ] Redirect kept for at least 1 year
- [ ] Domain auto-renew or reminder set
- [ ] Old properties removed only after approval
- [ ] This plan updated with final results
