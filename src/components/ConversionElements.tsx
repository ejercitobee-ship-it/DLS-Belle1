import { Star, Quote, CheckCircle2, Shield, Truck, Award, Phone, Mail, CreditCard } from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';

// Customer Reviews Section
export function CustomerReviews({ productName }: { productName: string }) {
  const reviews = [
    {
      name: "Michael R.",
      location: "New York, NY",
      rating: 5,
      date: "2 weeks ago",
      text: "Exceptional quality and craftsmanship. The climate control is precise and the Spanish cedar aroma is divine. Worth every penny.",
      verified: true,
    },
    {
      name: "James T.",
      location: "Miami, FL",
      rating: 5,
      date: "1 month ago",
      text: "The dual-zone feature is a game-changer. My cigars and wine are perfectly preserved. The expert concierge support throughout was impeccable.",
      verified: true,
    },
    {
      name: "Robert K.",
      location: "Chicago, IL",
      rating: 5,
      date: "2 months ago",
      text: "Outstanding customer service from Dunn's. They helped me choose the perfect cabinet for my collection. Highly recommend!",
      verified: true,
    },
  ];

  return (
    <section className="py-16 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Customer Reviews
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4">
            What Our Clients Say About {productName}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-cream-200 ml-2">4.9 out of 5 stars</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              
              <div className="flex items-start gap-2 mb-4">
                <Quote size={16} className="text-gold-500/50 mt-1 flex-shrink-0" />
                <p className="text-cream-200/80 text-sm leading-relaxed">{review.text}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-charcoal-800/50">
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-cream-200/40 text-xs">{review.location}</p>
                </div>
                <div className="text-right">
                  {review.verified && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 size={12} />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                  <p className="text-cream-200/40 text-xs mt-1">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Buy From Us Section
export function WhyBuyFromUs() {
  const benefits = [
    {
      icon: Shield,
      title: "2-Year Warranty",
      description: "Every cabinet comes with our comprehensive warranty covering parts and labor."
    },
    {
      icon: Truck,
      title: "Expert Concierge Support",
      description: "Professional delivery coordination and setup guidance. We handle everything with care."
    },
    {
      icon: Award,
      title: "Expert Consultation",
      description: "Our specialists help you choose the perfect humidor for your collection."
    },
    {
      icon: CheckCircle2,
      title: "Authentic Products",
      description: "100% genuine products from authorized manufacturers."
    },
  ];

  return (
    <section className="py-16 bg-charcoal-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Why Buy From Us
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">
            The Dunn's Luxury Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
                <benefit.icon size={24} className="text-gold-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
              <p className="text-cream-200/60 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-cream-200/60">
            <Shield size={20} className="text-gold-500" />
            <span className="text-sm">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-cream-200/60">
            <Award size={20} className="text-gold-500" />
            <span className="text-sm">Lifetime Support</span>
          </div>
          <div className="flex items-center gap-2 text-cream-200/60">
            <Phone size={20} className="text-gold-500" />
            <a href={PHONE_HREF} className="text-sm hover:text-gold-400 transition-colors">
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
export function FAQSection() {
  const faqs = [
    {
      question: "What is the ideal temperature and humidity for cigar storage?",
      answer: "The ideal conditions are 65-72°F (18-22°C) with 65-72% relative humidity. Our cabinets maintain these conditions automatically with precision climate control."
    },
    {
      question: "How long does delivery take?",
      answer: "Expert concierge support typically includes 5-10 business days for delivery coordination. Our team will contact you to schedule a convenient delivery time and handle all setup."
    },
    {
      question: "What does the 2-year warranty cover?",
      answer: "Our warranty covers all parts and labor for the climate control system, compressor, and electrical components. It also includes replacement of defective parts."
    },
    {
      question: "Can I store wine and cigars in the same cabinet?",
      answer: "Yes! Our dual-zone cabinets like the Raching SD800 and CS600 are specifically designed to store both cigars and wine at their optimal conditions independently."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible financing through Shop Pay Installments — choose \"Shop Pay · Pay in installments\" at checkout. Contact us at " + PHONE_NUMBER + " for more details."
    },
  ];

  return (
    <section className="py-16 bg-charcoal-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              FAQ
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
              <p className="text-cream-200/70 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Payment Methods Section
export function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6">
      <div className="flex items-center gap-2 text-cream-200/60 text-sm">
        <CreditCard size={16} />
        <span>Secure Payment:</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Shop Pay */}
        <div className="h-6 px-2 bg-white rounded flex items-center justify-center text-indigo-700 font-bold text-[8px]">Shop&nbsp;Pay</div>
        {/* Visa */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-blue-900 font-bold text-xs">VISA</div>
        {/* Mastercard */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
          <div className="flex">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1" />
          </div>
        </div>
        {/* Amex */}
        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[8px]">AMEX</div>
        {/* PayPal */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-blue-800 font-bold text-[8px]">PayPal</div>
      </div>
    </div>
  );
}

// Consultation CTA Banner
export function ConsultationBanner() {
  return (
    <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-800 border-b border-gold-500/30 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-cream-100 text-sm font-medium">
              Can't find what you're looking for?
            </p>
            <p className="text-cream-200/70 text-xs">
              Our specialists can custom-design your perfect humidor solution.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <a
              href="tel:8884319214"
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 rounded text-xs font-semibold transition-colors"
            >
              <Phone size={14} />
              Call
            </a>
            <a
              href="mailto:support@dunnluxuryselections.com"
              className="flex items-center justify-center gap-1 px-3 py-2 border border-gold-500/50 hover:border-gold-400 text-gold-400 text-xs font-semibold transition-colors rounded"
            >
              <Mail size={14} />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Low Stock Urgency Component
export function LowStockBadge({ stock }: { stock: number }) {
  if (stock > 5) return null;
  
  return (
    <div className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-3 py-1 rounded-full">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      Only {stock} left in stock
    </div>
  );
}
