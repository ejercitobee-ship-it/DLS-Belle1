export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Legal</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Terms of <span className="text-gradient-gold italic">Service</span>
        </h1>
        <p className="text-cream-200/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10">

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using the Dunn's Luxury Selections website and placing orders with us, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.</p>
          </Section>

          <Section title="2. Products and Pricing">
            <p>All products are subject to availability. We reserve the right to discontinue any product at any time without notice. Prices are displayed in US Dollars and are subject to change without prior notice. We make every effort to ensure that prices displayed are accurate; however, in the event of a pricing error, we reserve the right to cancel affected orders and issue a full refund.</p>
          </Section>

          <Section title="3. Orders and Payment">
            <p>By placing an order, you represent that you are at least 18 years of age and that all information provided is accurate and complete. Payment must be received in full before orders are dispatched. We accept all major credit cards and other payment methods as displayed at checkout. All transactions are processed securely through our payment processor.</p>
          </Section>

          <Section title="4. Shipping and Delivery">
            <p>We offer nationwide delivery across the United States. Delivery timeframes are estimates and may vary depending on your location and product availability. Risk of loss and title for products pass to you upon delivery. For full details, please refer to our Delivery Information page. Dunn's Luxury Selections is not liable for delays caused by carriers, weather events, or circumstances beyond our reasonable control.</p>
          </Section>

          <Section title="5. Returns and Warranty">
            <p>We stand behind the quality of every product we sell. Please refer to our Returns & Warranty page for full details on our return policy, warranty terms, and the process for submitting a claim. All returns must be authorised in advance. Products must be returned in their original, unused condition and packaging.</p>
          </Section>

          <Section title="6. Bespoke Services">
            <p>Custom walk-in humidor and bespoke installation projects are governed by separate written agreements provided at the time of consultation. Deposits are non-refundable once design work or material procurement has commenced. All project timelines and specifications agreed in writing take precedence over any general statements on this website.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this website — including text, images, logos, and product descriptions — is the property of Dunn's Luxury Selections or its licensed suppliers. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the fullest extent permitted by law, Dunn's Luxury Selections shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our products or website. Our total liability in connection with any order shall not exceed the purchase price paid for the relevant product.</p>
          </Section>

          <Section title="9. Governing Law">
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be subject to the exclusive jurisdiction of the courts of the applicable jurisdiction.</p>
          </Section>

          <Section title="10. Changes to These Terms">
            <p>We reserve the right to modify these Terms of Service at any time. Updated terms will be posted on this page with a revised date. Your continued use of our website following any changes constitutes your acceptance of the new terms.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For any questions regarding these Terms of Service, please contact:</p>
            <div className="mt-4 space-y-1 text-cream-200/50 text-sm">
              <p>Dunn's Luxury Selections</p>
              <p>Email: <a href="mailto:support@dunnluxuryselections.com" className="text-gold-400 hover:text-gold-300 transition-colors">support@dunnluxuryselections.com</a></p>
              <p>Phone: <a href="tel:8884319214" className="text-gold-400 hover:text-gold-300 transition-colors">(888) 431-9214</a></p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-white font-semibold mb-4 pb-2 border-b border-charcoal-800/50">{title}</h2>
      <div className="text-cream-200/60 text-sm leading-relaxed space-y-3 [&_strong]:text-cream-100 [&_a]:text-gold-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
