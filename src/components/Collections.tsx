import { useState } from 'react';

const STATIC_COLLECTIONS = [
  {
    id: 'electronic',
    handle: 'electronic-humidors',
    name: 'Electronic Humidors',
    description: 'Climate-controlled precision storage with digital humidity management.',
    image: '/images/hero-bg.png',
    count: '9 Products',
    featured: true,
  },
  {
    id: 'desktop',
    handle: 'desktop-humidors',
    name: 'Desktop Humidors',
    description: 'Elegant stationary humidors for the discerning home collector.',
    image: '/images/collections-travel-humidors.png',
    count: '22 Products',
    featured: false,
  },
  {
    id: 'cabinet-humidors',
    handle: 'cabinet-humidors',
    name: 'Cabinet Humidors',
    description: 'Floor-standing masterpieces from 600 to 4,000+ cigars — classic cedar cabinets and precision smart-climate systems.',
    image: '/images/bespoke-walk-in-humidor.png',
    count: '8 Products',
    featured: false,
  },
  {
    id: 'travel',
    handle: 'travel-humidors',
    name: 'Travel Humidors',
    description: 'Protect your prized cigars wherever your journey takes you.',
    image: '/images/collections-travel-humidors.png',
    count: '18 Products',
    featured: false,
  },
  {
    id: 'accessories',
    handle: 'accessories',
    name: 'Accessories',
    description: 'Premium cutters, lighters, and care essentials for the aficionado.',
    image: '/images/hero-bg.png',
    count: '31 Products',
    featured: false,
  },
  {
    id: 'bespoke-walkins',
    handle: 'bespoke-walkins',
    name: 'Walk-in Humidors',
    description: 'Bespoke floor-to-ceiling installations for the ultimate cigar sanctuary.',
    image: '/images/bespoke-walk-in-humidor.png',
    count: 'By Commission',
    featured: true,
  },
];

type DisplayCollection = {
  id: string;
  handle: string;
  name: string;
  description: string;
  image: string;
  count: string;
  featured: boolean;
};

export default function Collections() {
  const [collections] = useState<DisplayCollection[]>(STATIC_COLLECTIONS);
  // Note: Removed unnecessary fetchCollections API call
  // STATIC_COLLECTIONS provides excellent fallback and prevents waterfall
  // Collections page has dedicated fetching via Collections.tsx component

  // Shop by Collections section temporarily hidden - design needs refinement
  return null;
}
