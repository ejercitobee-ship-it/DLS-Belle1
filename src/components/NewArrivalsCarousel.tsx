import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useNewArrivals } from '../hooks/useNewArrivals';

export const NewArrivalsCarousel = () => {
  const { products, loading, error } = useNewArrivals();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-cream-200">Loading new arrivals...</p>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-charcoal-900 via-charcoal-950 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Premium Styling */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          {/* Gold Divider Line */}
          <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent mb-4 sm:mb-6" />

          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4 tracking-tight">
            <span className="font-bold text-white">Latest.</span>{' '}
            <span className="font-bold italic text-gold-400">Acquisitions.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-cream-200/70 text-sm sm:text-base md:text-lg font-light tracking-wide">
            Handpicked selections from our most exclusive collection
          </p>
        </div>

        {/* Carousel Container with Border */}
        <div className="relative border border-gold-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 bg-charcoal-900/50 backdrop-blur-sm hover:border-gold-500/50 transition-colors duration-500">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%_-_12px)] lg:flex-[0_0_calc(33.333%_-_16px)] min-w-0"
                >
                  <a
                    href={`/product/${product.handle}`}
                    className="group cursor-pointer h-full block"
                  >
                    {/* Product Card */}
                    <div className="flex flex-col h-full bg-charcoal-800 rounded-xl overflow-hidden border border-gold-500/40 hover:border-gold-500/70 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/20">
                      {/* Image Container */}
                      <div className="relative overflow-hidden aspect-square bg-charcoal-700">
                        {/* NEW Badge */}
                        <div className="absolute top-4 right-4 z-10 bg-gold-500 text-charcoal-950 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest">
                          NEW
                        </div>

                        {/* Image */}
                        <img
                          src={product.image.url}
                          alt={product.image.alt}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />

                        {/* Subtle Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 md:p-6">
                        {/* Title */}
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                            {product.title}
                          </h3>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gold-400">
                            ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-cream-200/60 tracking-widest uppercase">
                            Excl. Tax
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Left */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-12 md:-translate-x-16 z-20 p-2.5 sm:p-3 rounded-full border-2 border-gold-500 bg-gold-500/25 hover:border-gold-400 hover:bg-gold-500/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 group hover:shadow-lg hover:shadow-gold-500/30 sm:border sm:bg-gold-500/15"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="sm:w-6 sm:h-6 text-gold-300 group-hover:text-gold-200 transition-colors" />
          </button>

          {/* Navigation Buttons - Right */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-12 md:translate-x-16 z-20 p-2.5 sm:p-3 rounded-full border-2 border-gold-500 bg-gold-500/25 hover:border-gold-400 hover:bg-gold-500/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 group hover:shadow-lg hover:shadow-gold-500/30 sm:border sm:bg-gold-500/15"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="sm:w-6 sm:h-6 text-gold-300 group-hover:text-gold-200 transition-colors" />
          </button>
        </div>

        {/* View All Button - Prominent CTA */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <a
            href="/new-arrivals"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gold-gradient text-charcoal-950 font-semibold text-xs sm:text-sm md:text-base tracking-widest uppercase px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 rounded-lg hover:shadow-xl hover:shadow-gold-500/40 active:scale-95 transition-all duration-300 group"
          >
            View All New Arrivals
            <ChevronRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Subtext */}
          <p className="text-cream-200/60 text-xs sm:text-sm tracking-wide mt-3 sm:mt-4">
            Explore our complete collection of luxury selections
          </p>
        </div>
      </div>
    </section>
  );
};
