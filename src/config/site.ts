// Site-wide facts in ONE place. The live URL itself lives in astro.config.mjs
// (`site`) — every absolute URL (canonical, sitemap, JSON-LD, Open Graph) is
// built from Astro.site, never hard-coded.

export const SITE = {
  name: 'StrengthCalc',
  tagline: 'Free, transparent one rep max calculators',
  /**
   * Public contact address shown on Contact, About, Privacy and Terms.
   * If ever emptied, pages show a visible notice and the build prints a warning.
   */
  contactEmail: 'strengthcalc.team@outlook.com',
  /** Unit the calculators start in (visitors can always switch). */
  defaultUnit: 'lb' as 'kg' | 'lb',
  /** Effective / last-updated date for Privacy, Terms and Disclaimer. */
  policyDate: '2026-11-02',
  /** Date the calculator pages and methodology were last reviewed. */
  contentReviewed: '2026-11-02',
};

if (!SITE.contactEmail) {
  console.warn('[StrengthCalc] SITE.contactEmail is empty — set it in src/config/site.ts before launch.');
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
      { href: '/1rm-percentage-calculator/', label: '1RM Percentage Calculator' },
      { href: '/plate-calculator/', label: 'Plate Calculator' },
      { href: '/warm-up-calculator/', label: 'Warm-up Calculator' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/guides/1rm-formulas/', label: '1RM Formula Guide' },
      { href: '/guides/how-to-test-1rm/', label: 'How to Test Your 1RM Safely' },
      { href: '/methodology/', label: 'Methodology' },
      { href: '/guides/', label: 'All guides' },
    ],
  },
  {
    title: 'StrengthCalc',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/contact/', label: 'Contact' },
      { href: '/privacy/', label: 'Privacy Policy' },
      { href: '/terms/', label: 'Terms of Use' },
      { href: '/disclaimer/', label: 'Disclaimer' },
    ],
  },
];
