// Site-wide facts in ONE place. The live URL itself lives in astro.config.mjs
// (`site`) — every absolute URL (canonical, sitemap, JSON-LD, Open Graph) is
// built from Astro.site, never hard-coded.

export const SITE = {
  name: '1RMHub',
  tagline: 'Free, transparent one rep max calculators',
  /**
   * Public contact address shown on Contact, About, Privacy and Terms.
   * If ever emptied, pages show a visible notice and the build prints a warning.
   */
  contactEmail: 'contact@1rmhub.com',
  /** Unit the calculators start in (visitors can always switch). */
  defaultUnit: 'lb' as 'kg' | 'lb',
  /** Effective / last-updated date for Privacy, Terms and Disclaimer. */
  policyDate: '2026-11-07',
  /** Default date the calculator pages and methodology were last reviewed. */
  contentReviewed: '2026-11-02',
};

/**
 * Pages reviewed after the site-wide date. When a page's content changes, add
 * (or update) its path here: the visible "Last reviewed" date, its JSON-LD and
 * its sitemap <lastmod> (astro.config.mjs) all read from reviewedFor().
 */
const PAGE_REVIEWED: Record<string, string> = {
  '/dots-calculator/': '2026-11-09',
  '/bench-press-calculator/': '2026-11-09',
  '/overhead-press-calculator/': '2026-11-09',
  '/barbell-row-calculator/': '2026-11-09',
  '/rpe-calculator/': '2026-11-09',
  '/1rm-percentage-calculator/': '2026-11-09',
  '/warm-up-calculator/': '2026-11-09',
  '/plate-calculator/': '2026-11-09',
  '/front-squat-calculator/': '2026-11-09',
  '/incline-bench-press-calculator/': '2026-11-09',
  '/hip-thrust-calculator/': '2026-11-09',
  '/strength-percentile-calculator/': '2026-11-09',
};

/** Last-reviewed date (YYYY-MM-DD) for a page path such as '/dots-calculator/'. */
export function reviewedFor(path: string): string {
  return PAGE_REVIEWED[path] ?? SITE.contentReviewed;
}

/**
 * The real person responsible for the site, shown on About, in guide bylines
 * and as the schema.org Person behind the content. Facts only — never add
 * credentials or experience that are not true.
 */
export const EDITOR = {
  name: 'Muhammad Khuzaima',
  role: 'Creator and editor',
  /** Anchor on the About page where the bio lives. */
  href: '/about/#editor',
  bio:
    'Muhammad Khuzaima is the creator and editor of 1RMHub. He built the site to give lifters one rep max ' +
    'calculators that show their working: every formula is checked against its published source and covered by ' +
    'automated tests before it goes live. He is responsible for the site’s content and corrects any error readers report.',
};

if (!SITE.contactEmail) {
  console.warn('[1RMHub] SITE.contactEmail is empty — set it in src/config/site.ts before launch.');
}

/** Human-readable date, e.g. "November 2, 2026" (fixed locale, UTC). */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(`${iso}T00:00:00Z`) : iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** ISO date (YYYY-MM-DD) for <time datetime> and JSON-LD. */
export function isoDate(d: string | Date): string {
  return (typeof d === 'string' ? new Date(`${d}T00:00:00Z`) : d).toISOString().slice(0, 10);
}

/**
 * ISO date-time with an explicit timezone (start of the day, UTC), e.g.
 * "2026-11-02T00:00:00+00:00". Google's Article guidelines expect
 * datePublished/dateModified with a timezone; a bare date is flagged.
 */
export function isoDateTime(d: string | Date): string {
  return `${isoDate(d)}T00:00:00+00:00`;
}

/** Primary navigation and footer link groups — the single list of public pages. */
export const NAV = [
  { href: '/', label: '1RM Calculator' },
  { href: '/1rm-percentage-calculator/', label: 'Percentages' },
  { href: '/plate-calculator/', label: 'Plates' },
  { href: '/warm-up-calculator/', label: 'Warm-up' },
  { href: '/guides/', label: 'Guides' },
];

export const FOOTER_GROUPS = [
  {
    title: 'Calculators',
    links: [
      { href: '/', label: 'One Rep Max Calculator' },
      { href: '/bench-press-calculator/', label: 'Bench Press Calculator' },
      { href: '/squat-calculator/', label: 'Squat Calculator' },
      { href: '/deadlift-calculator/', label: 'Deadlift Calculator' },
      { href: '/overhead-press-calculator/', label: 'Overhead Press Calculator' },
      { href: '/barbell-row-calculator/', label: 'Barbell Row Calculator' },
      { href: '/front-squat-calculator/', label: 'Front Squat Calculator' },
      { href: '/incline-bench-press-calculator/', label: 'Incline Bench Press Calculator' },
      { href: '/hip-thrust-calculator/', label: 'Hip Thrust Calculator' },
      { href: '/1rm-percentage-calculator/', label: '1RM Percentage Calculator' },
      { href: '/plate-calculator/', label: 'Plate Calculator' },
      { href: '/warm-up-calculator/', label: 'Warm-up Calculator' },
      { href: '/rpe-calculator/', label: 'RPE Calculator' },
      { href: '/dots-calculator/', label: 'DOTS Calculator' },
      { href: '/strength-percentile-calculator/', label: 'Strength Percentile Calculator' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/guides/what-is-1rm/', label: 'What Is 1RM?' },
      { href: '/guides/1rm-formulas/', label: '1RM Formula Guide' },
      { href: '/guides/how-to-test-1rm/', label: 'How to Test Your 1RM Safely' },
      { href: '/guides/training-max/', label: 'What Is a Training Max?' },
      { href: '/guides/rpe-scale/', label: 'RPE Scale Explained' },
      { href: '/guides/increase-1rm/', label: 'How to Increase Your 1RM' },
      { href: '/methodology/', label: 'Methodology' },
      { href: '/guides/', label: 'All guides' },
    ],
  },
  {
    title: '1RMHub',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/contact/', label: 'Contact' },
      { href: '/privacy/', label: 'Privacy Policy' },
      { href: '/terms/', label: 'Terms of Use' },
      { href: '/disclaimer/', label: 'Disclaimer' },
    ],
  },
];
