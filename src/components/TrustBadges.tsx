import { RotateCcw, Truck, ShieldCheck, Phone, PackageCheck, Star, Mail } from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';

const SUPPORT_EMAIL = 'support@dunnluxuryselections.com';

/**
 * "Shop with Confidence" block shown below the Add to Cart button on every
 * product page. Claims here match the Returns & Warranty and Delivery pages.
 */
export function ShopWithConfidence() {
  const items = [
    {
      icon: RotateCcw,
      title: '10-Day Return Policy',
      subtitle: 'Unused, in original packaging',
      href: '/returns-warranty',
    },
    {
      icon: Truck,
      title: 'Expert Concierge Support',
      subtitle: 'Included on cabinet & electronic humidors',
      href: '/delivery-info',
    },
    {
      icon: ShieldCheck,
      title: 'Manufacturer Warranty',
      subtitle: '1–3 years on cabinets & electronics',
      href: '/returns-warranty',
    },
    {
      icon: PackageCheck,
      title: 'Insured Shipping',
      subtitle: 'Every order ships fully insured',
    },
    {
      icon: Phone,
      title: 'Expert Support',
      subtitle: `${PHONE_NUMBER} · Mon–Fri 9–6 CST`,
      href: PHONE_HREF,
    },
    {
      icon: Mail,
      title: 'Email a Specialist',
      subtitle: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
    },
  ];

  return (
    <div className="bg-charcoal-900/40 border border-charcoal-800/50 rounded-lg p-5 sm:p-6 mt-6 sm:mt-8">
      <p className="text-gold-400 text-[10px] font-medium tracking-[0.35em] uppercase mb-5 sm:mb-6 text-center">
        Shop with Confidence
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6">
        {items.map(({ icon: Icon, title, subtitle, href }) => {
          const content = (
            <>
              <div className="w-9 h-9 rounded-full bg-charcoal-950 border border-charcoal-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-charcoal-900 group-hover:border-gold-500/30 group-focus-within:bg-charcoal-900 group-focus-within:border-gold-500/30 transition-all">
                <Icon size={15} className="text-gold-500" />
              </div>
              <div className="min-w-0">
                <p className="text-cream-100 text-xs font-semibold leading-tight">{title}</p>
                <p className="text-cream-200/50 text-[11px] mt-0.5 line-clamp-2">{subtitle}</p>
              </div>
            </>
          );
          return href ? (
            <a
              key={title}
              href={href}
              className="flex items-start sm:items-center gap-3 group rounded px-2 py-1 -mx-2 -my-1 hover:bg-charcoal-800/20 focus-within:bg-charcoal-800/20 focus:outline-none transition-colors"
            >
              {content}
            </a>
          ) : (
            <div key={title} className="flex items-start sm:items-center gap-3">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Review request banner shown near the FAQ on product pages.
 */
export function ReviewCallout({ productName }: { productName: string }) {
  const subject = encodeURIComponent(`Product Review: ${productName}`);
  const body = encodeURIComponent(
    `Hi Dunn's team,\n\nI'd like to leave a review for my ${productName}.\n\nRating (1-5 stars):\nMy review:\n\nOrder number (optional):`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-14 md:mt-16">
      <div className="bg-charcoal-900/40 border border-gold-700/20 rounded-xl p-6 sm:p-8 md:p-10 text-center">
        <div className="flex items-center justify-center gap-1 mb-4 sm:mb-5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={18} className="text-gold-500 fill-gold-500" />
          ))}
        </div>
        <h3 className="font-serif text-xl sm:text-2xl text-white font-bold mb-2 sm:mb-3 leading-tight">
          Own one already? Help other collectors decide.
        </h3>
        <p className="text-cream-200/50 text-sm sm:text-base mb-6 sm:mb-7 leading-relaxed max-w-xl mx-auto">
          We're working toward 50+ verified customer reviews — your experience matters.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
          className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 sm:px-7 py-3 rounded hover:shadow-lg hover:shadow-gold-600/30 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-charcoal-900 active:scale-95 transition-all"
        >
          <Star size={14} className="flex-shrink-0" />
          Write a Review
        </a>
      </div>
    </div>
  );
}
