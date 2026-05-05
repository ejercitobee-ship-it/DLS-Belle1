import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Loader2, Tag } from 'lucide-react';
import { fetchArticles, type ShopifyArticle } from '../lib/shopify';

const CATEGORIES = ['All', 'Cigar Care', 'New Arrivals', 'Brand Stories'] as const;
type Category = (typeof CATEGORIES)[number];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function articleCategory(article: ShopifyArticle): string {
  const tags = article.tags.map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('cigar care') || t.includes('care'))) return 'Cigar Care';
  if (tags.some((t) => t.includes('new arrival') || t.includes('arrivals'))) return 'New Arrivals';
  if (tags.some((t) => t.includes('brand') || t.includes('story') || t.includes('stories'))) return 'Brand Stories';
  const blogTitle = article.blog.title.toLowerCase();
  if (blogTitle.includes('care')) return 'Cigar Care';
  if (blogTitle.includes('arrival')) return 'New Arrivals';
  if (blogTitle.includes('brand')) return 'Brand Stories';
  return 'Brand Stories';
}

// ─── Placeholder image when Shopify has no image ─────────────────────────────
const FALLBACK_IMG = 'https://images.pexels.com/photos/5379763/pexels-photo-5379763.jpeg?auto=compress&cs=tinysrgb&w=1200';

function articleImage(article: ShopifyArticle): string {
  return article.image?.url || FALLBACK_IMG;
}

// ─── Featured article (full-width) ───────────────────────────────────────────

function FeaturedArticle({ article }: { article: ShopifyArticle }) {
  const cat = articleCategory(article);
  const img = articleImage(article);

  return (
    <article className="group relative rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/40 transition-all duration-300">
      <div className="grid md:grid-cols-2 min-h-[420px] md:min-h-[500px]">
        {/* Image */}
        <div className="relative overflow-hidden bg-charcoal-800 md:order-2 aspect-[16/9] md:aspect-auto">
          <img
            src={img}
            alt={article.image?.altText ?? article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-charcoal-950/30 hidden md:block" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-8 md:p-12 md:order-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
              <Tag size={9} />
              {cat}
            </span>
            <span className="text-cream-200/30 text-xs">Featured</span>
          </div>

          <h2 className="font-serif text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-4 group-hover:text-gold-200 transition-colors duration-200">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="text-cream-200/55 text-sm md:text-base leading-relaxed mb-7 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mb-8 text-cream-200/35 text-xs">
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {article.author.name}
            </span>
            <span className="w-px h-3 bg-charcoal-700" />
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <a
            href={`#article/${article.blog.handle}/${article.handle}`}
            className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded self-start hover:opacity-90 transition-opacity group/btn"
          >
            Read Article
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Grid article card ────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: ShopifyArticle }) {
  const cat = articleCategory(article);
  const img = articleImage(article);

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/40 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-800 flex-shrink-0">
        <img
          src={img}
          alt={article.image?.altText ?? article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-charcoal-950/80 backdrop-blur-sm border border-gold-500/30 text-gold-400 text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            <Tag size={9} />
            {cat}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <h3 className="font-serif text-white font-bold text-base md:text-lg leading-snug mb-3 group-hover:text-gold-200 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-cream-200/50 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mb-5 text-cream-200/30 text-xs mt-auto">
          <span className="flex items-center gap-1.5 truncate">
            <User size={11} />
            <span className="truncate">{article.author.name}</span>
          </span>
          <span className="w-px h-3 bg-charcoal-700 flex-shrink-0" />
          <span className="flex items-center gap-1.5 flex-shrink-0">
            <Calendar size={11} />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <a
          href={`#article/${article.blog.handle}/${article.handle}`}
          className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold tracking-widest uppercase transition-colors group/link"
        >
          Read Article
          <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ category }: { category: Category }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-px bg-gold-500/40 mx-auto mb-2" />
      <p className="text-cream-200/40 text-sm tracking-wide text-center">
        {category === 'All'
          ? 'No articles published yet. Check back soon.'
          : `No articles in "${category}" yet.`}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Journal() {
  const [articles, setArticles] = useState<ShopifyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchArticles(50);
        if (!cancelled) setArticles(data);
      } catch {
        // fall through — empty state shown
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => articleCategory(a) === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
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
              The Dunn's Journal
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6 max-w-3xl">
            Stories of Craft,{' '}
            <span className="text-gradient-gold italic">Culture & Connoisseurship</span>
          </h1>

          <p className="text-cream-200/60 text-base md:text-lg leading-relaxed max-w-xl">
            Insights on cigar care, collector culture, and the art of the perfect smoke.
          </p>
        </div>
      </div>

      {/* ── Category filters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-gold-gradient text-charcoal-950 border-transparent shadow-lg shadow-gold-900/30'
                  : 'bg-transparent text-cream-200/50 border-charcoal-700/60 hover:border-gold-500/40 hover:text-gold-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={32} className="text-gold-500 animate-spin" />
            <p className="text-cream-200/40 text-sm tracking-widest uppercase">Loading Articles</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="grid">
            <EmptyState category={activeCategory} />
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-10 md:space-y-14">
            {/* Featured */}
            <FeaturedArticle article={featured} />

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
