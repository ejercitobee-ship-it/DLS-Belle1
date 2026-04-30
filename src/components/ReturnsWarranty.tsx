import { Shield, RotateCcw, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function ReturnsWarranty() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Support</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Returns &amp; <span className="text-gradient-gold italic">Warranty</span>
        </h1>
        <p className="text-cream-200/60 text-lg leading-relaxed mb-16 max-w-2xl">
          We stand behind every product in our collection. Our returns and warranty policy is designed to give you complete peace of mind.
        </p>

        {/* Policy overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
            <div className="w-12 h-12 rounded-full border border-gold-600/40 flex items-center justify-center mb-5">
              <RotateCcw size={20} className="text-gold-500" />
            </div>
            <h2 className="font-serif text-2xl text-white font-semibold mb-3">Returns Policy</h2>
            <p className="text-cream-200/55 text-sm leading-relaxed mb-4">We accept returns on most items within <strong className="text-cream-100">30 days</strong> of delivery, provided they are unused and in their original packaging with all accessories and documentation included.</p>
            <p className="text-cream-200/55 text-sm leading-relaxed">Returns must be authorised by our team before sending any items back. Please contact us to initiate the process and receive a Return Merchandise Authorisation (RMA) number.</p>
          </div>
          <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
            <div className="w-12 h-12 rounded-full border border-gold-600/40 flex items-center justify-center mb-5">
              <Shield size={20} className="text-gold-500" />
            </div>
            <h2 className="font-serif text-2xl text-white font-semibold mb-3">Warranty Coverage</h2>
            <p className="text-cream-200/55 text-sm leading-relaxed mb-4">All products are covered by the manufacturer's warranty. Electronic humidors and cabinet units typically carry a <strong className="text-cream-100">1–3 year warranty</strong> covering defects in materials and workmanship.</p>
            <p className="text-cream-200/55 text-sm leading-relaxed">Warranty claims must be supported by proof of purchase. We will coordinate with the manufacturer on your behalf to ensure a smooth resolution.</p>
          </div>
        </div>

        {/* Process steps */}
        <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8 mb-12">
          <h2 className="font-serif text-2xl text-white font-semibold mb-8">How to Return an Item</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Contact Us First', desc: 'Email or call our support team to describe your issue and reason for return. We will issue an RMA number and provide return shipping instructions.' },
              { step: '02', title: 'Pack Securely', desc: 'Return items in their original packaging. Ensure the humidor and all accessories are secured to prevent transit damage. Mark your RMA number clearly on the outer box.' },
              { step: '03', title: 'Ship the Item', desc: 'Send the item to the address provided by our team. We recommend using a tracked and insured shipping service. Return shipping costs are the customer\'s responsibility unless the return is due to a defect or error on our part.' },
              { step: '04', title: 'Refund or Replacement', desc: 'Once we receive and inspect the item, we will process your refund or send a replacement within 5–7 business days. Refunds are issued to the original payment method.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-gold-600/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-400 text-xs font-bold">{step}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable items */}
        <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8 mb-12">
          <h2 className="font-serif text-2xl text-white font-semibold mb-6">Non-Returnable Items</h2>
          <div className="space-y-3">
            {[
              'Items that have been used, loaded with cigars, or show evidence of humidity exposure.',
              'Bespoke or custom-ordered products made specifically to your specifications.',
              'Items returned without prior authorisation or missing their original packaging.',
              'Accessories such as hygrometers, humidification solution, or Boveda packs once opened.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={14} className="text-gold-500/60 flex-shrink-0 mt-0.5" />
                <p className="text-cream-200/55 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
          <h2 className="font-serif text-2xl text-white font-semibold mb-4">Start a Return or Warranty Claim</h2>
          <p className="text-cream-200/55 text-sm leading-relaxed mb-6">Our customer care team is available Monday through Friday, 9:00 AM – 6:00 PM CST.</p>
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
