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
      title: 'Free White-Glove Delivery',
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
    <div className="bg-charcoal-900/40 border border-charcoal-800/50 rounded-lg p-5 mt-6">
      <p className="text-gold-400 text-[10px] font-medium tracking-[0.35em] uppercase mb-4 text-center">
        Shop with Confidence
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {items.map(({ icon: Icon, title, subtitle, href }) => {
          const content = (
            <>
              <div className="w-8 h-8 rounded-full bg-charcoal-950 border border-charcoal-700/50 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-gold-500" />
              </div>
              <div className="min-w-0">
                <p className="text-cream-100 text-xs font-semibold">{title}</p>
                <p className="text-cream-200/40 text-[11px] truncate">{subtitle}</p>
              </div>
            </>
          );
          return href ? (
            <a key={title} href={href} className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
              {content}
            </a>
          ) : (
            <div key={title} className="flex items-center gap-3">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-charcoal-900/40 border border-gold-700/20 rounded-xl p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={16} className="text-gold-500 fill-gold-500" />
          ))}
        </div>
        <h3 className="font-serif text-xl text-white font-bold mb-2">
          Own one already? Help other collectors decide.
        </h3>
        <p className="text-cream-200/50 text-sm mb-5">
          We're working toward 50+ verified customer reviews — your experience matters.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
          className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded hover:opacity-90 transition-opacity"
        >
          <Star size={13} />
          Write a Review
        </a>
      </div>
    </div>
  );
}
