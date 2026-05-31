import { useState, useEffect } from 'react';
import { ChevronDown, Star, ShoppingBag } from 'lucide-react';
import { getStaticProduct } from '../lib/staticProducts';

// Product Recommendations Section
export function ProductRecommendations({ currentProductId, currentHandle }: { currentProductId?: string; currentHandle?: string }) {
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    name: string;
    price: string;
    image: string;
    rating: number;
    handle: string;
  }>>([]);

  useEffect(() => {
    // Get products from static products that are different from current
    const handles = [
      'raching-sd800',
      'raching-cs600', 
      'reagan-1600',
      'raching-h880',
    ].filter(h => h !== currentHandle);

    const products = handles.map(handle => {
      const product = getStaticProduct(handle);
      if (product) {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '/generated-1777557213922-8v5be.png',
          rating: product.rating || 4.8,
          handle: product.handle,
        };
      }
      return null;
    }).filter(Boolean) as Array<{
      id: string;
      name: string;
      price: string;
      image: string;
      rating: number;
      handle: string;
    }>;

    setRecommendations(products.slice(0, 4));
  }, [currentHandle]);

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
          {recommendations.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.handle}`}
              className="group bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden hover:border-gold-500/30 transition-all"
            >
              <div className="aspect-square bg-charcoal-800/30 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="text-gold-500 fill-gold-500" />
                  <span className="text-cream-200/60 text-xs">{product.rating}</span>
                </div>
                <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gold-400 font-bold">{product.price}</span>
                  <span className="text-cream-200/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </div>
            </a>
          ))}
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
      question: "What does the 2-year warranty cover?",
      answer: "Our comprehensive warranty covers all parts and labor for the climate control system, compressor, electrical components, and any manufacturing defects. We also provide lifetime technical support."
    },
    {
      question: "Can I return the product if I'm not satisfied?",
      answer: "Yes, we offer a 10-day return policy for most products. Cabinet humidors must be returned in original condition with all packaging. Please contact our support team at (888) 431-9214 to initiate a return."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible financing through Affirm and Shop Pay for qualified buyers. You can select these options at checkout or contact us at (888) 431-9214 for more details."
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
