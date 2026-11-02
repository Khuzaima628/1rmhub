// schema.org JSON-LD builders. Every node describes only what is visibly on
// the page: no ratings, no reviews, no invented authors, no prices beyond the
// true "free". Nodes are linked by @id so one page = one coherent @graph.
import { SITE, EDITOR } from '../config/site';

export type Node = Record<string, unknown>;
export interface Crumb { name: string; href: string }

export const ids = (site: string) => ({
  website: `${site}/#website`,
  org: `${site}/#organization`,
  editor: `${site}/#editor`,
});

/** The site's real creator/editor (see EDITOR in config/site.ts). */
export function personNode(site: string): Node {
  return {
    '@type': 'Person',
    '@id': ids(site).editor,
    name: EDITOR.name,
    jobTitle: EDITOR.role,
    url: `${site}${EDITOR.href}`,
    worksFor: { '@id': ids(site).org },
  };
}

export function websiteNode(site: string): Node {
  return {
    '@type': 'WebSite',
    '@id': ids(site).website,
    url: `${site}/`,
    name: SITE.name,
    description: SITE.tagline,
    inLanguage: 'en',
    publisher: { '@id': ids(site).org },
  };
}

export function organizationNode(site: string): Node {
  return {
    '@type': 'Organization',
    '@id': ids(site).org,
    name: SITE.name,
    url: `${site}/`,
    logo: { '@type': 'ImageObject', url: `${site}/logo-512.png`, width: 512, height: 512 },
    founder: { '@id': ids(site).editor },
    ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
  };
}

export function breadcrumbNode(site: string, crumbs: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${site}${c.href}`,
    })),
  };
}

export function webPageNode(opts: {
  site: string; url: string; name: string; description: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
  reviewed?: string;
}): Node {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: 'en',
    isPartOf: { '@id': ids(opts.site).website },
    publisher: { '@id': ids(opts.site).org },
    ...(opts.reviewed ? { lastReviewed: opts.reviewed } : {}),
  };
}

/** A free, browser-based calculator. Deliberately no aggregateRating/review. */
export function webAppNode(opts: { site: string; url: string; name: string; description: string; features: string[] }): Node {
  return {
    '@type': 'WebApplication',
    '@id': `${opts.url}#app`,
    name: opts.name,
    url: opts.url,
    description: opts.description,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any (runs in a web browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: opts.features,
    publisher: { '@id': ids(opts.site).org },
  };
}

/** Editorial article, written by the site's real editor and published by the site. */
export function articleNode(opts: {
  site: string; url: string; headline: string; description: string; published: Date; updated?: Date;
}): Node {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
    datePublished: opts.published.toISOString().slice(0, 10),
    dateModified: (opts.updated ?? opts.published).toISOString().slice(0, 10),
    author: { '@id': ids(opts.site).editor },
    publisher: { '@id': ids(opts.site).org },
    image: `${opts.site}/og-image.png`,
    inLanguage: 'en',
  };
}

/** FAQPage — only for questions rendered visibly on the same page. */
export function faqNode(faqs: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
