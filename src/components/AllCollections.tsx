import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Loader2,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import {
  fetchProducts,
  fetchCollections,
  type ShopifyProduct,
  type ShopifyCollection,
} from '../lib/shopify';
import { useCart } from '../context/CartContext';
import { getProductPrice, getDefaultVariantId } from '../hooks/useShopifyCollection';
import BreadcrumbSchema from './BreadcrumbSchema';
import FinancingBanner from './FinancingBanner';
import { getCollectionLinks } from '../lib/internalLinkMap';

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const PAGE_SIZE = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isNewArrival(product: ShopifyProduct): boolean {
  return product.tags.some(
    (t) => t.toLowerCase().includes('new') || t.toLowerCase().includes('arrival'),
  );
}

function sortProducts(products: ShopifyProduct[], sort: SortKey): ShopifyProduct[] {
  const arr = [...products];
  if (sort === 'price-asc') return arr.sort((a, b) => priceNum(a) - priceNum(b));
  if (sort === 'price-desc') return arr.sort((a, b) => priceNum(b) - priceNum(a));
  if (sort === 'newest') return arr.reverse();
  return arr;
}

function priceNum(p: ShopifyProduct): number {
  return parseFloat(p.priceRange.minVariantPrice.amount);
}

function _formatMoney(amount: string, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    parseFloat(amount),
  );
}
void _formatMoney; // available for future use

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imgUrl = product.featuredImage?.url ?? product.images[0]?.url ?? '';
  const imgAlt = product.featuredImage?.altText ?? product.title;
  const { price, compareAt } = getProductPrice(product);
  const isNew = isNewArrival(product);
  const productPageHref = `/product/${product.handle}`;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variantId = getDefaultVariantId(product);
    addItem({
      id: product.id,
      shopifyVariantId: variantId,
      name: product.title,
      price,
      priceNum: parseFloat(product.priceRange.minVariantPrice.amount),
      image: imgUrl,
      category: product.productType,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <a
      href={productPageHref}
      className="group relative flex flex-col bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/40 rounded-xl overflow-hidden transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-charcoal-900 flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={imgAlt}
            className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cream-200/20 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-gold-gradient text-charcoal-950 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded shadow-lg">
              New
            </span>
          )}
          {compareAt && (
            <span className="bg-charcoal-950/80 backdrop-blur-sm border border-red-500/40 text-red-400 text-[9px] font-semibold tracking-widest uppercase px-2 py-1 rounded">
              Sale
            </span>
          )}        </div>

        {/* Add to Cart — hover only */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-charcoal-950/90 backdrop-blur-sm border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 text-gold-400 hover:text-gold-300 text-[10px] font-semibold tracking-[0.2em] uppercase py-2.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        >
          <ShoppingBag size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <h3 className="font-serif text-white font-semibold text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-gold-200 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto pt-2">
          <span className="text-gold-400 font-semibold text-sm md:text-base">{price}</span>
          {compareAt && (
            <span className="text-cream-200/30 text-xs line-through">{compareAt}</span>
          )}
        </div>

        <span className="inline-flex items-center justify-center text-cream-200/50 group-hover:text-gold-400 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors border-t border-charcoal-700/50 pt-3 -mx-1"
        >
          View Product
          <ChevronRight size={12} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}

// ─── Filter / Sort Bar ────────────────────────────────────────────────────────

function FilterBar({
  collections,
  selectedCollection,
  onCollectionChange,
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: {
  collections: ShopifyCollection[];
  selectedCollection: string;
  onCollectionChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  minPrice: number;
  onMinPriceChange: (v: number) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-cream-200/30 text-xs tracking-widest uppercase flex-shrink-0">
          <SlidersHorizontal size={13} />
          Filter
        </div>

        {/* Collection dropdown */}
        <div className="relative">
          <select
            value={selectedCollection}
            onChange={(e) => onCollectionChange(e.target.value)}
            className="appearance-none bg-charcoal-900 border border-charcoal-700/60 hover:border-gold-500/40 focus:border-gold-500/60 text-cream-200/70 text-xs font-medium tracking-wide rounded px-4 py-2.5 pr-8 outline-none transition-colors cursor-pointer"
          >
            <option value="">All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.handle}>
                {c.title}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cream-200/30" />
        </div>

        {/* Sort dropdown */}
        <div className="relative sm:ml-auto">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none bg-charcoal-900 border border-charcoal-700/60 hover:border-gold-500/40 focus:border-gold-500/60 text-cream-200/70 text-xs font-medium tracking-wide rounded px-4 py-2.5 pr-8 outline-none transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cream-200/30" />
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-cream-200/30 text-xs tracking-widest uppercase flex-shrink-0">Price Range</span>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => onMinPriceChange(e.target.value ? parseFloat(e.target.value) : 0)}
            className="bg-charcoal-900 border border-charcoal-700/60 hover:border-gold-500/40 focus:border-gold-500/60 text-cream-200/70 text-xs font-medium rounded px-3 py-2.5 outline-none transition-colors w-24"
          />
          <span className="text-cream-200/30">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => onMaxPriceChange(e.target.value ? parseFloat(e.target.value) : 0)}
            className="bg-charcoal-900 border border-charcoal-700/60 hover:border-gold-500/40 focus:border-gold-500/60 text-cream-200/70 text-xs font-medium rounded px-3 py-2.5 outline-none transition-colors w-24"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllCollections() {
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const [sort, setSort] = useState<SortKey>('price-desc');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fetch initial products & collections in parallel
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productsResult, collectionsResult] = await Promise.all([
          fetchProducts(50),
          fetchCollections(20),
        ]);
        if (!cancelled) {
          setAllProducts(productsResult.products);
          setHasNextPage(productsResult.hasNextPage);
          setEndCursor(productsResult.endCursor);
          setCollections(collectionsResult);
        }
      } catch {
        // empty state shown
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchProducts(50, endCursor ?? undefined);
      setAllProducts((prev) => [...prev, ...result.products]);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
      setVisibleCount((c) => c + PAGE_SIZE);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, loadingMore, endCursor]);

  // Filter by collection (client-side via tags / productType matching collection title)
  const collectionFiltered = selectedCollection
    ? allProducts.filter((p) => {
        const col = collections.find((c) => c.handle === selectedCollection);
        if (!col) return true;
        // match by productType or tag containing collection title words
        const titleWords = col.title.toLowerCase().split(' ').filter((w) => w.length > 3);
        const pType = p.productType.toLowerCase();
        const pTags = p.tags.map((t) => t.toLowerCase()).join(' ');
        return titleWords.some((w) => pType.includes(w) || pTags.includes(w));
      })
    : allProducts;

  // Filter by price range
  const priceFiltered = collectionFiltered.filter((p) => {
    const price = priceNum(p);
    const minCheck = minPrice === 0 || price >= minPrice;
    const maxCheck = maxPrice === 0 || price <= maxPrice;
    return minCheck && maxCheck;
  });

  const sorted = sortProducts(priceFiltered, sort);
  const displayed = sorted.slice(0, visibleCount);
  const canLoadMore = visibleCount < sorted.length || hasNextPage;

  function handleLoadMore() {
    if (visibleCount < sorted.length) {
      setVisibleCount((c) => c + PAGE_SIZE);
    } else {
      loadMore();
    }
  }

  // Reset visible count when filter/sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCollection, sort, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' }
          ]}
          className="mb-8 pt-4"
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-charcoal-950 border-b border-charcoal-800/60">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 md:pt-24 md:pb-18">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs tracking-widest uppercase font-medium transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Our Collections
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6 max-w-2xl">
            The Complete{' '}
            <span className="text-gradient-gold italic">Dunn's Selection</span>
          </h1>

          <p className="text-cream-200/60 text-base md:text-lg leading-relaxed max-w-xl">
            Every humidor and accessory, curated for collectors who demand the finest.
          </p>
        </div>
      </div>

      {/* ── Quick Collection Links ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-2xl text-white font-bold mb-8">Browse Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCollectionLinks().map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg p-6 transition-colors duration-300"
            >
              <h3 className="font-serif text-lg text-white font-semibold group-hover:text-gold-300 transition-colors mb-2">
                {link.label}
              </h3>
              <p className="text-cream-200/50 text-sm">
                Explore this collection
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Financing Banner */}
      <FinancingBanner variant="compact" className="my-12" />

      {/* ── Filter bar + count ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <FilterBar
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          sort={sort}
          onSortChange={setSort}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
        />
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={32} className="text-gold-500 animate-spin" />
            <p className="text-cream-200/40 text-sm tracking-widest uppercase">Loading Products</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Product count */}
            <p className="text-cream-200/35 text-xs tracking-wide mb-6">
              Showing{' '}
              <span className="text-cream-200/60 font-medium">{displayed.length}</span>
              {sorted.length > displayed.length && (
                <> of <span className="text-cream-200/60 font-medium">{sorted.length}</span></>
              )}{' '}
              product{sorted.length !== 1 ? 's' : ''}
            </p>

            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-px bg-gold-500/40 mx-auto mb-2" />
                <p className="text-cream-200/40 text-sm tracking-wide text-center">
                  No products found for this filter.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {displayed.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {canLoadMore && (
                  <div className="flex justify-center mt-14">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-3 border border-gold-500/50 hover:border-gold-400 text-gold-400 hover:text-gold-300 text-xs font-semibold tracking-[0.25em] uppercase px-10 py-4 rounded transition-all duration-200 hover:bg-gold-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore && <Loader2 size={14} className="animate-spin" />}
                      {loadingMore ? 'Loading…' : 'Load More Products'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
