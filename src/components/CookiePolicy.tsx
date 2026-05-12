export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Legal</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Cookie <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-cream-200/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10">

          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files placed on your device by a website when you visit. They allow the website to remember your actions and preferences over a period of time, so you don't have to keep re-entering information every time you return or navigate between pages.</p>
          </Section>

          <Section title="2. How We Use Cookies">
            <p>Dunn's Luxury Selections uses cookies and similar technologies to:</p>
            <ul>
              <li><strong>Essential cookies</strong> — enable core functionality such as security, session management, and cart persistence. The website cannot function properly without these.</li>
              <li><strong>Performance cookies</strong> — collect anonymous data about how visitors use our site, including which pages are visited most often, to help us improve performance and user experience.</li>
              <li><strong>Preference cookies</strong> — remember your settings and preferences (e.g., currency, language) to personalise your browsing experience.</li>
              <li><strong>Marketing cookies</strong> — track your browsing habits to enable us to show you relevant advertisements across the web. These are only used where you have consented.</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Cookies">
            <p>We may use third-party services — such as Google Analytics, Shopify, and Meta Pixel — that also set cookies on your device. These providers have their own privacy and cookie policies, and we encourage you to review them. We do not have access to or control over cookies set by third parties.</p>
          </Section>

          <Section title="4. Managing Cookies">
            <p>You can control and manage cookies in your browser settings. Most browsers allow you to:</p>
            <ul>
              <li>View what cookies are stored and delete them individually.</li>
              <li>Block all cookies or block cookies from specific websites.</li>
              <li>Set your browser to notify you when a cookie is set.</li>
            </ul>
            <p>Please note that disabling certain cookies may affect the functionality of our website. In particular, disabling essential cookies may prevent you from adding items to your cart or completing a purchase.</p>
          </Section>

          <Section title="5. Cookie Retention">
            <p>Session cookies are temporary and expire when you close your browser. Persistent cookies remain on your device for varying periods — typically between 30 days and 2 years — depending on their purpose. You can delete persistent cookies at any time through your browser settings.</p>
          </Section>

          <Section title="6. Changes to This Policy">
            <p>We may update this Cookie Policy periodically. We will notify you of significant changes by posting an updated notice on our website. Continued use of our site following such changes constitutes your acceptance of the revised policy.</p>
          </Section>

          <Section title="7. Contact Us">
            <p>If you have any questions about our use of cookies, please contact us at:</p>
            <div className="mt-4 space-y-1 text-cream-200/50 text-sm">
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
