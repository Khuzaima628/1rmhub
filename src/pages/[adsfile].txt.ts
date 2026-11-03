// /ads.txt — generated only when ads are enabled (see src/config/ads.ts).
// While PUBLIC_ADSENSE_CLIENT is unset no path is returned, so no ads.txt is
// published at all — never a placeholder or someone else's publisher ID.
// (A dynamic route is used because a plain ads.txt.ts would always be built.)
import type { APIRoute, GetStaticPaths } from 'astro';
import { ADS_TXT } from '../config/ads';

export const getStaticPaths: GetStaticPaths = () => (ADS_TXT ? [{ params: { adsfile: 'ads' } }] : []);

export const GET: APIRoute = () =>
  new Response(ADS_TXT ?? '', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
