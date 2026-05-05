export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Legal</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Privacy <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-cream-200/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="prose-dunns space-y-10">

          <Section title="1. Who We Are">
            <p>Dunn's Luxury Selections ("we", "us", "our") operates the website at dunnluxuryselections.com. We are committed to safeguarding the privacy of our customers and website visitors. This policy sets out how we collect, use, and protect any information you provide to us.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following personal data:</p>
            <ul>
              <li><strong>Contact information</strong> — your name, email address, phone number, and mailing address when you place an order or enquire about bespoke services.</li>
              <li><strong>Order and transaction data</strong> — purchase history, billing details, and shipping information necessary to fulfil your orders.</li>
              <li><strong>Usage data</strong> — anonymised information about how you interact with our website, including pages visited, time on site, and referring URLs, collected via cookies and analytics tools.</li>
              <li><strong>Communications</strong> — any messages you send us via email, enquiry forms, or telephone.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfil your orders and bespoke project enquiries.</li>
              <li>Send transactional communications such as order confirmations and shipping updates.</li>
              <li>Respond to customer service requests and support queries.</li>
              <li>Send promotional emails and newsletters — only where you have opted in to receive them.</li>
              <li>Improve our website, product range, and service offerings.</li>
              <li>Comply with our legal and regulatory obligations.</li>
            </ul>
          </Section>

          <Section title="4. Sharing Your Information">
            <p>We do not sell, rent, or trade your personal information to third parties. We may share your data with trusted service providers — including payment processors, shipping carriers, and analytics platforms — solely to fulfil the purposes outlined above. All third parties are contractually obligated to keep your data confidential and secure.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal data only for as long as is necessary to provide our services and comply with applicable legal obligations. Order records are typically retained for seven years in accordance with tax and accounting requirements. You may request deletion of your data at any time (subject to legal retention obligations) by contacting us.</p>
          </Section>

          <Section title="6. Cookies">
            <p>Our website uses cookies to enhance your browsing experience and gather anonymous usage statistics. You may disable cookies through your browser settings; however, certain features of our website may be affected. For full details, please refer to our Cookie Policy.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal data. To exercise any of these rights, please contact us at <a href="mailto:support@dunnluxuryselections.com" className="text-gold-400 hover:text-gold-300 transition-colors">support@dunnluxuryselections.com</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Security">
            <p>We implement industry-standard security measures — including SSL encryption, access controls, and regular security reviews — to protect your personal data from unauthorised access, disclosure, or misuse.</p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites and encourage you to review their respective privacy policies.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Material changes will be communicated via a notice on our website. Your continued use of our site following any changes constitutes your acceptance of the revised policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For any questions or concerns regarding this Privacy Policy, please contact us:</p>
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
