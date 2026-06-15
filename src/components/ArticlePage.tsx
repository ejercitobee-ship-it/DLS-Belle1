import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Loader2, AlertCircle } from 'lucide-react';
import { fetchArticleByHandle, fetchArticles, type ShopifyArticle } from '../lib/shopify';
import { usePageMeta } from '../hooks/usePageMeta';

// ─── Shared helpers (mirror Journal.tsx) ─────────────────────────────────────

const FALLBACK_IMG =
  'https://images.pexels.com/photos/5379763/pexels-photo-5379763.jpeg?auto=compress&cs=tinysrgb&w=1200';

function articleImage(article: ShopifyArticle): string {
  return article.image?.url || FALLBACK_IMG;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function articleCategory(article: ShopifyArticle): string {
  const tags = article.tags.map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('cigar care') || t.includes('care'))) return 'Cigar Care';
  if (tags.some((t) => t.includes('new arrival') || t.includes('arrivals'))) return 'New Arrivals';
  if (tags.some((t) => t.includes('brand') || t.includes('story') || t.includes('stories')))
    return 'Brand Stories';
  const blogTitle = article.blog.title.toLowerCase();
  if (blogTitle.includes('care')) return 'Cigar Care';
  if (blogTitle.includes('arrival')) return 'New Arrivals';
  return 'Brand Stories';
}

// ─── Related article card ─────────────────────────────────────────────────────

function RelatedCard({ article }: { article: ShopifyArticle }) {
  const cat = articleCategory(article);
  const img = articleImage(article);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('navigate-article', {
        detail: { blogHandle: article.blog.handle, articleHandle: article.handle },
      }),
    );
  }

  return (
    <a
      href={`#article/${article.blog.handle}/${article.handle}`}
      onClick={handleClick}
      className="group flex flex-col rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/40 transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-800 flex-shrink-0">
        <img
          src={img}
          alt={article.image?.altText ?? article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-charcoal-950/80 backdrop-blur-sm border border-gold-500/30 text-gold-400 text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            <Tag size={9} />
            {cat}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h4 className="font-serif text-white font-semibold text-sm md:text-base leading-snug mb-3 line-clamp-2 group-hover:text-gold-200 transition-colors duration-200">
          {article.title}
        </h4>

        {article.excerpt && (
          <p className="text-cream-200/45 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mb-4 text-cream-200/30 text-xs">
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

        <span className="inline-flex items-center gap-1.5 text-gold-400 group-hover:text-gold-300 text-[10px] font-semibold tracking-widest uppercase transition-colors">
          Read Article
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ArticlePage({
  blogHandle,
  articleHandle,
}: {
  blogHandle: string;
  articleHandle: string;
}) {
  const [article, setArticle] = useState<ShopifyArticle | null>(null);
  const [related, setRelated] = useState<ShopifyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setArticle(null);
    setRelated([]);

    async function load() {
      try {
        const [found, allArticles] = await Promise.all([
          fetchArticleByHandle(blogHandle, articleHandle),
          fetchArticles(20),
        ]);
        if (cancelled) return;
        if (!found) {
          setNotFound(true);
        } else {
          setArticle(found);
          // Related: same category, exclude current, max 3
          const cat = articleCategory(found);
          const sameCategory = allArticles.filter(
            (a) => a.handle !== found.handle && articleCategory(a) === cat,
          );
          const others = allArticles.filter(
            (a) => a.handle !== found.handle && articleCategory(a) !== cat,
          );
          setRelated([...sameCategory, ...others].slice(0, 3));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [blogHandle, articleHandle]);

  // Set OG tags when article is loaded
  useEffect(() => {
    if (article) {
      const articlePath = `/journal/${article.blog.handle}/${article.handle}`;
      const articleImage = article.image?.url || 'https://images.pexels.com/photos/5379763/pexels-photo-5379763.jpeg?auto=compress&cs=tinysrgb&w=1200';

      usePageMeta({
        title: `${article.title} | Dunn's Luxury Selections`,
        description: article.excerpt || `Read this article from Dunn's Luxury Selections Journal.`,
        canonicalPath: articlePath,
        ogImage: articleImage,
      });
    }
  }, [article]);

  function goBack(e: React.MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'journal' }));
  }

  const BackLink = () => (
    <a
      href="/journal"
      onClick={goBack}
      className="inline-flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs tracking-widest uppercase font-medium transition-colors group"
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
      Back to The Journal
    </a>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="text-gold-500 animate-spin" />
        <p className="text-cream-200/40 text-sm tracking-widest uppercase">Loading Article</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center gap-6 px-4">
        <AlertCircle size={40} className="text-cream-200/20" />
        <p className="text-cream-200/50 text-base">Article not found.</p>
        <a
          href="/journal"
          onClick={goBack}
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs tracking-widest uppercase font-semibold transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Return to The Journal
        </a>
      </div>
    );
  }

  const cat = articleCategory(article);
  const img = articleImage(article);

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* ── Full-width Hero Image ── */}
      <div className="relative w-full h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden bg-charcoal-900">
        <img
          src={img}
          alt={article.image?.altText ?? article.title}
          className="w-full h-full object-cover"
        />
        {/* Deep gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/10" />

        {/* Back link on top of hero */}
        <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackLink />
        </div>

        {/* Article meta overlaid at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          {/* Category + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-gold-500/15 border border-gold-500/40 text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
              <Tag size={9} />
              {cat}
            </span>
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-charcoal-800/70 backdrop-blur-sm border border-charcoal-700/50 text-cream-200/50 text-[10px] font-medium tracking-wide px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-white font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-5 max-w-3xl drop-shadow-lg">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-cream-200/50 text-xs">
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {article.author.name}
            </span>
            <span className="w-px h-3.5 bg-charcoal-600" />
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-16">
        {/* Excerpt lead */}
        {article.excerpt && (
          <p className="font-serif text-cream-200/80 text-lg md:text-xl leading-relaxed mb-10 pb-10 border-b border-charcoal-800/60 italic">
            {article.excerpt}
          </p>
        )}

        {/* Rich HTML body */}
        <div
          className="article-body prose-article"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Bottom back link */}
        <div className="mt-14 pt-10 border-t border-charcoal-800/60">
          <BackLink />
        </div>
      </div>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <div className="border-t border-charcoal-800/60 bg-charcoal-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.35em] uppercase">
                Continue Reading
              </span>
            </div>
            <h2 className="font-serif text-white text-2xl md:text-3xl font-bold mb-10">
              You May Also Enjoy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {related.map((rel) => (
                <RelatedCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
