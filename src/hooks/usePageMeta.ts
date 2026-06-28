import { useEffect, useMemo } from 'react';

const BASE_URL = 'https://dunnluxuryselections.com';

interface PageMeta {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noindex?: boolean;
  canonicalUrl?: string; // Full URL for external canonical (e.g., syndicated content)
}

export function usePageMeta(meta: PageMeta) {
  // Synchronous update for SSR/prerender compatibility
  useMemo(() => {
    const canonicalPath = meta.canonicalPath;
    // Use provided canonicalUrl (for external sources) or build from canonicalPath
    const canonicalUrl = meta.canonicalUrl || `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

    // Update title
    document.title = meta.title;

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Update or create robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = meta.noindex ? 'noindex, nofollow' : 'index, follow';

    // Update description
    let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = meta.description;

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = meta.title;

    // Update OG description
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = meta.description;

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = canonicalUrl;

    // Update OG image if provided
    if (meta.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (ogImage) ogImage.content = meta.ogImage;
    }

    // Update Twitter title
    let twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    if (twTitle) twTitle.content = meta.title;

    // Update Twitter description
    let twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
    if (twDesc) twDesc.content = meta.description;

    // Update Twitter image if provided
    if (meta.ogImage) {
      let twImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
      if (twImage) twImage.content = meta.ogImage;
    }
  }, [meta.title, meta.description, meta.canonicalPath, meta.canonicalUrl, meta.ogImage, meta.noindex]);

  // Also run in useEffect for client-side navigation
  useEffect(() => {
    // Meta tags are already updated by useMemo above
  }, [meta.title, meta.description, meta.canonicalPath, meta.canonicalUrl, meta.ogImage, meta.noindex]);
}
