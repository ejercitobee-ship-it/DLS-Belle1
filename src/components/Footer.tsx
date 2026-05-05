import { memo } from 'react';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const shopLinks = [
  { label: 'Cabinet Humidors', href: '#cabinet-humidors' },
  { label: 'Desktop Humidors', href: '#desktop-humidors' },
  { label: 'Electronic Humidors', href: '#electronic-humidors' },
  { label: 'Travel Humidors', href: '#travel-humidors' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'New Arrivals', href: '#new-arrivals' },
];

const infoLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Bespoke Walk-In Humidors', href: '#walk-in-humidor' },
  { label: 'Delivery Information', href: '#delivery-info' },
  { label: 'Returns & Warranty', href: '#returns-warranty' },
  { label: 'Care Guides', href: '#care-guides' },
  { label: 'Contact Us', href: '#contact' },
];

export default memo(Footer);

function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <img
                src="/Untitled_design__5_-removebg-preview.png"
                alt="Dunn's Luxury Selections"
                className="h-28 w-auto object-contain"
              />
            </div>
            <p className="text-cream-200/50 text-sm leading-relaxed mb-6">
              America's premier destination for luxury cigar humidors. Precision,
              prestige, and presence — since day one.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/dunnluxuryselections"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-charcoal-700 hover:border-gold-600/50 rounded flex items-center justify-center text-cream-200/40 hover:text-gold-500 transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.facebook.com/dunnluxuryselections"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-charcoal-700 hover:border-gold-600/50 rounded flex items-center justify-center text-cream-200/40 hover:text-gold-500 transition-colors"
              >
                <Facebook size={15} />
              </a>
              <a
                href="mailto:support@dunnluxuryselections.com"
                aria-label="Email"
                className="w-9 h-9 border border-charcoal-700 hover:border-gold-600/50 rounded flex items-center justify-center text-cream-200/40 hover:text-gold-500 transition-colors"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-200/50 text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Information
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-200/50 text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-cream-200/50">
                <MapPin size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <span>Nationwide delivery &amp; consultations available</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-200/50">
                <Mail size={14} className="text-gold-500 flex-shrink-0" />
                <a
                  href="mailto:support@dunnluxuryselections.com"
                  className="hover:text-gold-400 transition-colors"
                >
                  support@dunnluxuryselections.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-200/50">
                <Phone size={14} className="text-gold-500 flex-shrink-0" />
                <a href="tel:8884319214" className="hover:text-gold-400 transition-colors">(888) 431-9214</a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-charcoal-900/60 border border-charcoal-800/60 rounded-lg">
              <p className="text-cream-200/50 text-xs leading-relaxed">
                <span className="text-gold-400 font-medium">Bespoke enquiries</span> — Contact us to
                schedule your private consultation with our design team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream-200/30 text-xs">
            &copy; {new Date().getFullYear()} Dunn's Luxury Selections. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: 'Privacy Policy', href: '#privacy-policy' },
              { label: 'Terms of Service', href: '#terms-of-service' },
              { label: 'Cookie Policy', href: '#cookie-policy' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-cream-200/30 text-xs hover:text-gold-500/60 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
