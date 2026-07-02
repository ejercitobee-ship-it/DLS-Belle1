// Per-product specification registry for Shopify products.
// Shopify's Storefront API query doesn't fetch metafields, so specs for the
// high-consideration items are curated here from the manufacturer data in each
// product's own description. Keyed by Shopify product handle.

export type ProductSpecs = Record<string, string>;

const WHITE_GLOVE = 'Expert concierge support, 5–10 business days';
const STANDARD_SHIPPING = 'Ships within 2–3 business days';

const SPECS_BY_HANDLE: Record<string, ProductSpecs> = {
  // ── Raching electronic humidors ──────────────────────────────────────────
  'raching-rr980-cigar-humidor': {
    'Capacity': '3,000–4,000 cigars',
    'Dimensions': '690 × 700 × 1865 mm (27.2" × 27.6" × 73.4")',
    'Climate control': '16–22°C (±1°C) · 60–75% RH (±1%)',
    'Cooling system': 'High-efficiency water-cooling',
    'Power': '110V / 220V compatible',
    'Interior': '6 Spanish cedar shelves + 4 Spanish cedar drawers',
    'Smart features': 'TFT touchscreen, cigar diagnostics, fingerprint + password lock, app remote unlock, ammonia removal',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'raching-ct48a-stainless-steel-grand-humidor': {
    'Capacity': '2,500–3,000 cigars',
    'Dimensions': '690 × 700 × 1850 mm (27.2" × 27.6" × 72.8")',
    'Climate control': '16–22°C (±1°C) · 60–75% RH (±1%)',
    'Cooling system': 'High-precision water-cooling',
    'Exterior': 'Anti-fingerprint stainless steel',
    'Interior': '8 Spanish cedar shelves (3 on slide rails) with partition boards',
    'Extras': 'Quick dehumidification drawer, ammonia removal device',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'raching-sd800-dual-zone-cigar-wine-cabinet': {
    'Capacity': '~1,500–1,600 cigars + 120–130 wine bottles (750 ml)',
    'Dimensions': '1200 × 610 × 1920 mm (47.2" × 24" × 75.6")',
    'Weight': '~190 kg (~419 lbs) · ~760 L total volume',
    'Climate control': 'Cigar: 16–22°C ±1°C, 60–75% RH ±1% · Wine: 5–22°C ±1°C',
    'Cooling system': 'Water-cooling + high-performance compressor',
    'Interior': '8 Spanish cedar shelves (cigar) + 9 beech wood shelves (wine)',
    'Exterior': 'Large display glass door with wooden accents',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'raching-cs600-luxury-cigar-humidor-cabinet': {
    'Capacity': '1,200–1,400 cigars + 100–110 wine bottles (750 ml)',
    'Dimensions': '1200 × 610 × 1760 mm (47.2" × 24" × 69.3")',
    'Climate control': 'Cigar: 16–22°C ±1°C, 60–75% RH ±2% · Wine: 5–22°C ±1°C',
    'Cooling system': 'Dual-zone compressor with independent controls',
    'Interior': '7 Spanish cedar shelves (cigar) + 10 beech wood shelves (wine)',
    'Exterior': 'Large glass door with digital control panel',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'raching-mon800a-water-cooled-precision-cigar-humidor': {
    'Capacity': '500–600 cigars (~150 L)',
    'Dimensions': '600 × 610 × 820 mm (23.6" × 24" × 32.3")',
    'Weight': '59 kg (130 lbs)',
    'Climate control': '16–22°C (±1°C) · 60–75% RH (±1%)',
    'Cooling system': 'Water-cooling with LCD digital control panel',
    'Interior': '2-layer Spanish cedar shelves',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'raching-mon800a-water-cooled-cigar-humidor-cabinet': {
    'Capacity': '500–600 cigars (~150 L)',
    'Dimensions': '600 × 610 × 820 mm (23.6" × 24" × 32.3")',
    'Weight': '59 kg (130 lbs)',
    'Climate control': '16–22°C (±1°C) · 60–75% RH (±1%)',
    'Cooling system': 'Water-cooling with LCD digital control panel',
    'Exterior': 'Carbon fiber',
    'Interior': '2-layer Spanish cedar shelves',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },

  // ── Electronic cabinet humidors ──────────────────────────────────────────
  'reagan-electronic-cigar-cabinet': {
    'Capacity': 'Up to 4,000 cigars',
    'Climate control': 'Dual zones: 41–71°F · 56–78% RH',
    'Climate system': 'Built-in humidification + dehumidification, dual water reservoirs, circulating fans',
    'Power': '110/120V standard (220/240V available)',
    'Control': 'LCD touchscreen with adjustable hygrometer and de-mist function',
    'Interior': '12 cedar-lined sliding shelves with adjustable dividers',
    'Exterior': 'Dark cherry, embossed side panels, crown molding, tinted tempered glass doors, white LED lighting',
    'Warranty': '2-year manufacturer warranty',
    'Lead time': WHITE_GLOVE,
  },
  'remington-lite-custom-finish-cigar-humidor': {
    'Capacity': 'Up to 2,000 cigars',
    'Climate control': '41–71°F · 56–78% RH, digital touchscreen with auto-saved settings',
    'Climate system': 'Built-in humidification + auxiliary fan, dehumidification assist, de-mist function',
    'Finish': '10 custom melamine finishes available',
    'Display': 'Heavy-duty tempered glass door with high-grade seal, white LED lighting',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': 'Custom order: 9–12 weeks (special-order finishes)',
  },
  'redford-lite-custom-finish': {
    'Climate control': '41–71°F (°F/°C toggle) · 56–78% RH with adjustable hygrometer calibration',
    'Climate system': 'Integrated electronic humidification + auxiliary fan, dehumidification assist',
    'Finish': '10 custom melamine finishes available',
    'Interior': 'Removable cedar-lined trays, 4 drawer-style shelves on metal slides, 3 adjustable dividers per shelf',
    'Display': 'Tempered glass door with heavy-duty seal, white LED lighting',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': 'Custom finish: special order — contact us for current lead time',
  },

  // ── Classic cabinet humidors ─────────────────────────────────────────────
  'bermuda-large-cigar-cabinet-humidor': {
    'Capacity': '4,000 cigars',
    'Interior': 'Spanish cedar lining; 12 oversized removable trays with adjustable dividers',
    'Humidification': '24 humidifiers in 4 pull-out drawers + built-in external hygrometer',
    'Exterior': 'Dark cherry finish; dual full-length framed glass doors with lock & key',
    'Lighting': 'Optional touch-activated dimmable LED',
    'Upgrades': 'Rear wiring port for optional electric humidification',
    'Assembly required': 'No — delivered fully assembled',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': WHITE_GLOVE,
  },
  'saint-regis-large-cigar-humidor': {
    'Interior': 'Spanish cedar lining; 3 adjustable angled shelves + removable 9-division tray + lower storage compartment',
    'Humidification': '6 large oblong humidifiers + precision hygrometer',
    'Exterior': 'Cherry finish with crown molding and embossed doors; dual full-length glass doors + glass side panels',
    'Security': '2 lock & key sets',
    'Upgrades': 'Rear wiring port for optional electric humidification',
    'Assembly required': 'No — delivered fully assembled',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': WHITE_GLOVE,
  },
  'barbatus-2000-cigar-humidor': {
    'Capacity': '~2,000 cigars',
    'Interior': 'Spanish cedar lining; 6 oversized cedar trays with 12 adjustable dividers',
    'Humidification': '12 built-in humidifiers in 2 pull-out drawers + built-in external hygrometer',
    'Exterior': 'Dark cherry finish; full-length framed glass door with brass lock & key',
    'Upgrades': 'Rear wiring port for optional electric humidification',
    'Assembly required': 'No — delivered fully assembled',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': WHITE_GLOVE,
  },
  'spartacus-1000-cigar-humidor': {
    'Capacity': '~1,000 cigars',
    'Interior': 'Spanish cedar lining; 3 oversized trays with 8 adjustable dividers each',
    'Humidification': '6 built-in humidifiers in pull-out drawer + dedicated hygrometer',
    'Exterior': 'Dark cherry finish; full-length framed glass door with brass lock & key',
    'Upgrades': 'Rear wiring port for optional electric humidification',
    'Assembly required': 'No — delivered fully assembled',
    'Warranty': 'Manufacturer warranty (1–3 years)',
    'Lead time': WHITE_GLOVE,
  },
};

/**
 * Returns specs for a product. Curated entries take priority; otherwise a
 * minimal set of always-true policy facts is returned so every product page
 * has a Specifications section.
 */
export function getProductSpecs(handle: string, productType?: string): ProductSpecs {
  const curated = SPECS_BY_HANDLE[handle];
  if (curated) return curated;

  const fallback: ProductSpecs = {};
  if (productType) fallback['Type'] = productType;
  fallback['Warranty'] = 'Manufacturer warranty — see Returns & Warranty';
  fallback['Lead time'] = STANDARD_SHIPPING;
  fallback['Returns'] = '10-day return policy';
  return fallback;
}
