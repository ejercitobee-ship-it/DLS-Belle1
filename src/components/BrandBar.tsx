const brands = ['Raching', 'Humidor Supreme', 'Marciano', 'Modena', 'Santiago', 'Chalet', 'Amalfi'];

export default function BrandBar() {
  return (
    <section className="py-12 bg-charcoal-950 border-y border-charcoal-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-cream-200/30 text-[10px] tracking-[0.4em] uppercase mb-8">
          Authorised Stockist
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="font-serif text-xl md:text-2xl text-cream-200/20 hover:text-gold-500/60 transition-colors duration-300 cursor-default tracking-wide"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
