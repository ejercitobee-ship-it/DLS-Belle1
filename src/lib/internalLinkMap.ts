export interface RelatedLink {
  label: string;
  href: string;
  category: string;
}

/**
 * Related product navigation graph
 * Maps each product category to related products and FAQs
 */
export const internalLinkMap: Record<string, RelatedLink[]> = {
  '/collections/desktop-humidors': [
    { label: 'Cabinet Humidors', href: '/collections/cabinet-humidors', category: 'collections' },
    { label: 'Electronic Humidors', href: '/collections/electronic-humidors', category: 'collections' },
    { label: 'Bespoke Solutions', href: '/walk-in-humidor', category: 'services' },
    { label: 'How to Choose', href: '#faq', category: 'guides' },
    { label: 'Care Tips', href: '/care-guides', category: 'guides' }
  ],
  '/collections/cabinet-humidors': [
    { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
    { label: 'Travel Humidors', href: '/collections/travel-humidors', category: 'collections' },
    { label: 'Electronic Humidors', href: '/collections/electronic-humidors', category: 'collections' },
    { label: 'Maintenance Guide', href: '/care-guides', category: 'guides' }
  ],
  '/collections/travel-humidors': [
    { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
    { label: 'Cabinet Humidors', href: '/collections/cabinet-humidors', category: 'collections' },
    { label: 'Accessories', href: '/collections/accessories', category: 'collections' },
    { label: 'Preservation Tips', href: '/care-guides', category: 'guides' }
  ],
  '/collections/electronic-humidors': [
    { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
    { label: 'Cabinet Humidors', href: '/collections/cabinet-humidors', category: 'collections' },
    { label: 'Bespoke Walk-In', href: '/walk-in-humidor', category: 'services' },
    { label: 'Tech Guide', href: '#faq', category: 'guides' }
  ],
  '/collections/accessories': [
    { label: 'All Collections', href: '/all-collections', category: 'collections' },
    { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
    { label: 'Care & Maintenance', href: '/care-guides', category: 'guides' }
  ],
  '/walk-in-humidor': [
    { label: 'All Collections', href: '/all-collections', category: 'collections' },
    { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
    { label: 'Electronic Systems', href: '/collections/electronic-humidors', category: 'collections' },
    { label: 'FAQ', href: '#faq', category: 'guides' }
  ]
};

/**
 * Get related links for a given page
 */
export const getRelatedLinks = (pathname: string, limit = 5): RelatedLink[] => {
  return (internalLinkMap[pathname] || []).slice(0, limit);
};

/**
 * Get all collection links for navigation
 */
export const getCollectionLinks = (): RelatedLink[] => [
  { label: 'Desktop Humidors', href: '/collections/desktop-humidors', category: 'collections' },
  { label: 'Cabinet Humidors', href: '/collections/cabinet-humidors', category: 'collections' },
  { label: 'Travel Humidors', href: '/collections/travel-humidors', category: 'collections' },
  { label: 'Electronic Humidors', href: '/collections/electronic-humidors', category: 'collections' },
  { label: 'Accessories', href: '/collections/accessories', category: 'collections' }
];
