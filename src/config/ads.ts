// Advertising switch — the ONE place AdSense is configured.
//
// Ads stay completely off until PUBLIC_ADSENSE_CLIENT is set at build time
// (Cloudflare Pages → Settings → Variables, or a local .env file) to the
// publisher ID Google gives you after approval, e.g. "ca-pub-1234567890123456".
// It is a public identifier, not a secret.
//
// Setting it turns on, together:
//   - /ads.txt with Google's authorised-seller line (src/pages/[adsfile].txt.ts);
//   - the AdSense loader script in <head> (BaseLayout.astro);
//   - ad units wherever <AdSlot slot="…"> is given a real slot id;
//   - the advertising and cookie sections of the Privacy Policy.
// Before setting it, configure a Google-certified consent message for
// EEA/UK/Swiss visitors in AdSense → Privacy & messaging, and update
// SITE.policyDate (src/config/site.ts).

const raw = (import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '').trim();

// A wrong ID would publish an ads.txt for someone else's account, so a
// malformed value fails the build instead of being silently used or ignored.
if (raw && !/^ca-pub-\d{16}$/.test(raw)) {
  throw new Error(`PUBLIC_ADSENSE_CLIENT must look like "ca-pub-" followed by 16 digits; got "${raw}".`);
}

/** AdSense client ID ("ca-pub-…"), or null while ads are disabled. */
export const ADSENSE_CLIENT: string | null = raw || null;

export const ADS_ENABLED = ADSENSE_CLIENT !== null;

/**
 * The ads.txt line Google documents for AdSense publishers: domain, publisher
 * ID ("pub-…", without "ca-"), relationship, and Google's certification
 * authority ID (f08c47fec0942fa0).
 */
export const ADS_TXT = ADSENSE_CLIENT
  ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
  : null;
