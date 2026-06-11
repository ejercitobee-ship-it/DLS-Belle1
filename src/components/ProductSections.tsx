import { useState, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { fetchProducts, type ShopifyProduct } from '../lib/shopify';

// Product Recommendations Section - Fetches from Shopify
export function ProductRecommendations({
  currentProductId,
  currentHandle
}: {
  currentProductId?: string;
  currentHandle?: string;
}) {
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        // Fetch products from Shopify (first 20, then filter)
        const { products } = await fetchProducts(20);
        
        // Filter out current product and limit to 4
        const filtered = products
          .filter(p => p.id !== currentProductId && p.handle !== currentHandle)
          .slice(0, 4);
        
        setRecommendations(filtered);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [currentProductId, currentHandle]);

  if (loading) {
    return (
      <section className="py-16 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">You May Also Like</span>
            <h2 className="font-serif text-2xl md:text-3xl text-white font-bold mt-4">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-charcoal-800/30" />
                <div className="p-4">
                  <div className="h-4 bg-charcoal-800/50 rounded mb-2" />
                  <div className="h-4 bg-charcoal-800/50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              You May Also Like
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-bold">
            Recommended For You
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => {
            const imageUrl = product.featuredImage?.url || product.images?.[0]?.url || '/images/hero-bg.png';
            const price = product.priceRange?.minVariantPrice?.amount 
              ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
              : product.variants?.[0]?.price?.amount
              ? `$${parseFloat(product.variants[0].price.amount).toFixed(2)}`
              : 'Price on request';
            
            return (
              <a
                key={product.id}
                href={`/product/${product.handle}`}
                className="group bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden hover:border-gold-500/30 transition-all"
              >
                <div className="aspect-square bg-charcoal-800/30 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="text-gold-500 fill-gold-500" />
                    <span className="text-cream-200/60 text-xs">{(product as ShopifyProduct & { rating?: number }).rating || 4.8}</span>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 font-bold">{price}</span>
                    <span className="text-cream-200/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Product FAQ Section
export function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is the ideal temperature and humidity for cigar storage?",
      answer: "The ideal conditions are 65-72°F (18-22°C) with 65-72% relative humidity. Our humidors maintain these conditions automatically with precision climate control systems."
    },
    {
      question: "How long does delivery take?",
      answer: "White-glove delivery typically takes 5-10 business days for cabinet humidors. Our team will contact you to schedule a convenient delivery time and handle all setup, including placement and initial configuration."
    },
    {
      question: "Manufacturing Warranty Covers",
      answer: "Our comprehensive manufacturing warranty covers all parts and labor for the climate control system, compressor, electrical components, and any manufacturing defects. We also provide lifetime technical support."
    },
    {
      question: "Can I return the product if I'm not satisfied?",
      answer: "Yes, we offer a 10-day return policy for most products. Cabinet humidors must be returned in original condition with all packaging. Please contact our support team at (888) 431-9214 to initiate a return."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible financing through Shop Pay Installments for qualified buyers. Choose \"Shop Pay · Pay in installments\" at checkout, or contact us at (888) 431-9214 for more details."
    },
    {
      question: "How do I maintain my humidor?",
      answer: "Our electronic humidors are largely self-maintaining. We recommend checking the water reservoir every 2-3 months, cleaning the interior with a soft cloth annually, and ensuring proper air circulation around the unit."
    },
    {
      question: "What's the difference between Spanish cedar and regular cedar?",
      answer: "Spanish cedar (Cedrela odorata) is the gold standard for humidors. It naturally regulates humidity, repels tobacco beetles, and enhances cigar aging with its aromatic oils. All our premium humidors use genuine Spanish cedar."
    },
    {
      question: "Can I store wine and cigars in the same cabinet?",
      answer: "Yes! Our dual-zone cabinets like the Raching SD800 and CS600 are specifically designed with independent climate zones to store both cigars (65-72°F) and wine (55-65°F) at their optimal conditions."
    },
  ];

  return (
    <section className="py-16 bg-charcoal-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              FAQ
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-cream-200/60 mt-3 max-w-xl mx-auto">
            Everything you need to know about our humidors and services.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-charcoal-800/30 transition-colors"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gold-500 flex-shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5">
                  <p className="text-cream-200/70 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
