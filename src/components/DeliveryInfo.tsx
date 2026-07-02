import { Truck, Clock, Package, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

const deliveryOptions = [
  {
    icon: Truck,
    title: 'Standard Delivery',
    time: '5–10 Business Days',
    description: 'Available on most desktop humidors, travel humidors, and accessories. Delivered via FedEx or UPS with full tracking.',
    price: 'Free on qualifying orders',
  },
  {
    icon: Package,
    title: 'Expert Concierge Freight',
    time: '7–14 Business Days',
    description: 'Required for all cabinet and electronic humidors. Specialist freight carriers handle oversized items with care. Delivery to your door with optional inside placement and positioning support.',
    price: 'Quoted at checkout',
  },
  {
    icon: Clock,
    title: 'Expedited Delivery',
    time: '2–5 Business Days',
    description: 'Available on select in-stock items. Contact our team before ordering to confirm availability and eligibility for expedited service.',
    price: 'Contact us for pricing',
  },
];

export default function DeliveryInfo() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Support</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Delivery <span className="text-gradient-gold italic">Information</span>
        </h1>
        <p className="text-cream-200/60 text-lg leading-relaxed mb-16 max-w-2xl">
          We are committed to ensuring every Dunn's product arrives in perfect condition. Our delivery partners are carefully selected for reliability and care.
        </p>

        {/* Service area */}
        <div className="flex items-start gap-4 bg-charcoal-900 border border-gold-700/20 rounded-lg p-6 mb-12">
          <MapPin size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold mb-1">Nationwide Coverage</h3>
            <p className="text-cream-200/55 text-sm leading-relaxed">We deliver to all 50 US states. For international enquiries, please contact our team directly — we work with freight forwarders on a case-by-case basis for select international destinations.</p>
          </div>
        </div>

        {/* Delivery options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {deliveryOptions.map(({ icon: Icon, title, time, description, price }) => (
            <div key={title} className="bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/30 rounded-lg p-6 transition-colors">
              <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center mb-5">
                <Icon size={18} className="text-gold-500" />
              </div>
              <h3 className="font-serif text-lg text-white font-semibold mb-1">{title}</h3>
              <p className="text-gold-400 text-xs tracking-wider uppercase mb-3">{time}</p>
              <p className="text-cream-200/55 text-sm leading-relaxed mb-4">{description}</p>
              <p className="text-cream-200/40 text-xs border-t border-charcoal-800/50 pt-3">{price}</p>
            </div>
          ))}
        </div>

        {/* Important notes */}
        <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8 mb-12">
          <h2 className="font-serif text-2xl text-white font-semibold mb-6">Important Notes</h2>
          <div className="space-y-4">
            {[
              'All orders are processed within 1–3 business days of payment confirmation. You will receive a tracking number by email once your order ships.',
              'Delivery timeframes are estimates and begin from the date of dispatch, not the order date. We are not liable for carrier delays.',
              'For cabinet and electronic humidors shipped via freight, someone must be present to sign for delivery. Please ensure a contact number is provided at checkout.',
              'Inspect all items upon delivery before signing. If you notice damage to outer packaging, note this on the delivery receipt and contact us within 24 hours.',
              'Free shipping promotions apply to qualifying items only and are subject to change. Threshold requirements are displayed on the relevant product pages.',
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <p className="text-cream-200/60 text-sm leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
          <h2 className="font-serif text-2xl text-white font-semibold mb-4">Delivery Enquiries</h2>
          <p className="text-cream-200/55 text-sm leading-relaxed mb-6">Have a question about your delivery or need to arrange a specific time slot? Our team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:support@dunnluxuryselections.com" className="flex items-center gap-3 text-sm text-cream-200/60 hover:text-gold-400 transition-colors">
              <Mail size={15} className="text-gold-500" />
              support@dunnluxuryselections.com
            </a>
            <a href="tel:8884319214" className="flex items-center gap-3 text-sm text-cream-200/60 hover:text-gold-400 transition-colors">
              <Phone size={15} className="text-gold-500" />
              (888) 431-9214
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
