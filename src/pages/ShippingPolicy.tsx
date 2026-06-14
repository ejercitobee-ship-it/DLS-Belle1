import { CheckCircle2, Truck, Shield, RotateCcw, Contact } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Shipping & Returns Policy
          </h1>
          <p className="text-cream-200/60 text-lg">
            Transparent policies for luxury humidors and cigar accessories
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="text-gold-400" size={28} />
            <h2 className="font-serif text-2xl text-white font-bold">Shipping Information</h2>
          </div>
          <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-6 space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-cream-100 font-medium">Ships within 1-3 business days</p>
                <p className="text-cream-200/60 text-sm">From our authorized distributor partners</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-cream-100 font-medium">FedEx with full tracking</p>
                <p className="text-cream-200/60 text-sm">You will receive a tracking number via email</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-cream-100 font-medium">Packages insured during transit</p>
                <p className="text-cream-200/60 text-sm">Full coverage for damage claims</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-white font-bold mb-6">Estimated Shipping Costs</h2>
          <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal-800/50">
                  <th className="px-6 py-4 text-left text-cream-100 font-semibold">Region</th>
                  <th className="px-6 py-4 text-left text-cream-100 font-semibold">Cost</th>
                  <th className="px-6 py-4 text-left text-cream-100 font-semibold">Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-charcoal-800/30">
                  <td className="px-6 py-4 text-cream-200/80">California</td>
                  <td className="px-6 py-4 text-gold-400 font-semibold">$45.00</td>
                  <td className="px-6 py-4 text-cream-200/60">3-5 business days</td>
                </tr>
                <tr className="border-b border-charcoal-800/30">
                  <td className="px-6 py-4 text-cream-200/80">Texas</td>
                  <td className="px-6 py-4 text-gold-400 font-semibold">$55.00</td>
                  <td className="px-6 py-4 text-cream-200/60">3-5 business days</td>
                </tr>
                <tr className="border-b border-charcoal-800/30">
                  <td className="px-6 py-4 text-cream-200/80">New York</td>
                  <td className="px-6 py-4 text-gold-400 font-semibold">$50.00</td>
                  <td className="px-6 py-4 text-cream-200/60">2-4 business days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-cream-200/80">Other regions</td>
                  <td className="px-6 py-4 text-gold-400 font-semibold">$65.00</td>
                  <td className="px-6 py-4 text-cream-200/60">4-7 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-cream-200/40 text-sm mt-4">Use the ZIP code calculator on product pages for exact estimates.</p>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-gold-400" size={28} />
            <h2 className="font-serif text-2xl text-white font-bold">Manufacturing Warranty</h2>
          </div>
          <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-6 space-y-6">
            <div>
              <p className="text-cream-100 font-medium mb-2">Coverage includes:</p>
              <ul className="space-y-2 text-cream-200/60 text-sm">
                <li>Manufacturing defects in materials or workmanship</li>
                <li>Repair or replacement at manufacturers discretion</li>
                <li>Coverage period: 2-3 years (varies by brand)</li>
              </ul>
            </div>
            <div>
              <p className="text-cream-100 font-medium mb-2">We facilitate claims:</p>
              <p className="text-cream-200/60 text-sm">
                If your humidor has a manufacturing defect, we handle the warranty claim with the manufacturer on your behalf.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw className="text-gold-400" size={28} />
            <h2 className="font-serif text-2xl text-white font-bold">Return & Refund Policy</h2>
          </div>
          <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-6 space-y-6">
            <ul className="space-y-3 text-cream-200/60 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Damaged:</strong> Full refund if package arrives damaged</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Unopened:</strong> Store credit within 30 days</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Opened:</strong> Covered by manufacturer warranty</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Contact className="text-gold-400" size={28} />
            <h2 className="font-serif text-2xl text-white font-bold">Questions?</h2>
          </div>
          <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-6">
            <p className="text-cream-200/80 mb-4">
              Have questions? Our team is happy to help.
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).Tawk_API) {
                  (window as any).Tawk_API.maximize();
                }
              }}
              className="block text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              Chat with a specialist
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
