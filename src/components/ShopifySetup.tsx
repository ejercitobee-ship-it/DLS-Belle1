import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Store,
  Key,
  Code2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  AlertCircle,
  Package,
  Zap,
} from 'lucide-react';
import ShopifyConnect from './ShopifyConnect';

type Props = { onBack: () => void };

const ENV_EXAMPLE = `VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxx`;

const VARIANT_EXAMPLE = `// In any product file (e.g. ElectronicHumidors.tsx)
// Add shopifyVariantId to each product object:
{
  id: 1,
  name: 'Raching RR980 Cigar Humidor',
  price: '$6,387',
  priceNum: 6387,
  shopifyVariantId: 'gid://shopify/ProductVariant/1234567890',
  // ... rest of product fields
}`;

const GRAPHQL_EXAMPLE = `// Paste in Shopify Admin > Apps > Storefront API > GraphiQL
{
  products(first: 50) {
    edges {
      node {
        title
        handle
        variants(first: 1) {
          edges {
            node {
              id       # Copy this — use as shopifyVariantId
              title
              price { amount }
            }
          }
        }
      }
    }
  }
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-[10px] text-cream-200/40 hover:text-gold-400 transition-colors ml-auto"
    >
      {copied ? <><CheckCircle2 size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy size={11} />Copy</>}
    </button>
  );
}

function CodeBlock({ code, lang = '' }: { code: string; lang?: string }) {
  return (
    <div className="bg-charcoal-950 border border-charcoal-800/60 rounded-lg overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-charcoal-800/40 bg-charcoal-900/60">
        <Code2 size={12} className="text-gold-500 mr-2" />
        <span className="text-cream-200/30 text-[10px] tracking-widest uppercase">{lang || 'code'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="text-xs text-cream-200/70 p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

type StepProps = {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
  link?: { label: string; href: string };
};

function Step({ number, title, description, children, link }: StepProps) {
  const [open, setOpen] = useState(number <= 2);
  return (
    <div className="border border-charcoal-800/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-charcoal-900 hover:bg-charcoal-800/50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-950 font-bold text-sm flex-shrink-0">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-cream-100 text-sm font-semibold">{title}</p>
          <p className="text-cream-200/40 text-xs mt-0.5 line-clamp-1">{description}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-cream-200/40 flex-shrink-0" /> : <ChevronDown size={14} className="text-cream-200/40 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-5 bg-charcoal-950 space-y-4 border-t border-charcoal-800/30">
          <p className="text-cream-200/60 text-sm leading-relaxed">{description}</p>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-400 text-xs font-medium hover:text-gold-300 transition-colors border border-gold-600/30 px-4 py-2 rounded hover:bg-gold-700/10"
            >
              {link.label} <ExternalLink size={11} />
            </a>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

export default function ShopifySetup({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream-200/50 hover:text-gold-400 text-sm transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to shop
          </button>
          <div className="flex items-center gap-2 text-cream-200/40 text-xs">
            <Store size={13} className="text-gold-500" />
            Shopify Integration
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Integration Guide</span>
          </div>
          <h1 className="font-serif text-4xl text-white font-bold mb-4">
            Connect to <span className="text-gradient-gold italic">Shopify</span>
          </h1>
          <p className="text-cream-200/60 text-lg leading-relaxed max-w-2xl">
            Link this storefront to your Shopify store in under 10 minutes. Customers will browse here and checkout securely through Shopify — using your existing products, inventory, and payment processing.
          </p>
        </div>

        {/* Connect form — primary CTA */}
        <div className="mb-12">
          <ShopifyConnect />
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: ShoppingCart, title: 'Customer adds to cart', sub: 'On this storefront' },
            { icon: Zap, title: 'Redirected to Shopify', sub: 'Cart synced automatically' },
            { icon: Package, title: 'Shopify handles the rest', sub: 'Payment, orders, fulfillment' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg p-4 flex items-start gap-3">
              <div className="w-9 h-9 bg-gold-700/20 border border-gold-600/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gold-400" />
              </div>
              <div>
                <p className="text-cream-100 text-sm font-semibold">{title}</p>
                <p className="text-cream-200/40 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-700/30 rounded-lg px-4 py-3 mb-10 text-sm text-blue-300">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>The Shopify Storefront API is free to use. You only need a Shopify store (any plan) and a custom app with Storefront API access enabled.</span>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <Step
            number={1}
            title="Create a Shopify store (if you haven't already)"
            description="Sign up for a Shopify account and set up your store. You need at least the Basic plan. During your free trial you can test the full integration."
            link={{ label: 'Create Shopify store', href: 'https://www.shopify.com' }}
          />

          <Step
            number={2}
            title="Create products in Shopify Admin"
            description="Add each humidor and accessory as a product in your Shopify Admin. Make sure each product has at least one variant. The product price in Shopify will be used at checkout — keep it in sync with the prices shown here."
            link={{ label: 'Shopify Admin — Products', href: 'https://admin.shopify.com/store/products' }}
          />

          <Step
            number={3}
            title="Create a Custom App with Storefront API access"
            description="In Shopify Admin, go to Settings > Apps and sales channels > Develop apps. Create a new app, then under 'API credentials' enable the Storefront API. Grant it: unauthenticated_read_product_listings, unauthenticated_write_checkouts, unauthenticated_read_checkouts. Copy the Storefront API access token."
            link={{ label: 'Shopify Admin — Apps', href: 'https://admin.shopify.com/store/apps/development' }}
          >
            <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/30 rounded px-3 py-2 text-xs text-amber-300 mt-2">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              Required Storefront API scopes: <code className="font-mono bg-amber-900/30 px-1 rounded">unauthenticated_read_product_listings</code>, <code className="font-mono bg-amber-900/30 px-1 rounded">unauthenticated_write_checkouts</code>
            </div>
          </Step>

          <Step
            number={4}
            title="Add your credentials to .env"
            description="Open your project's .env file and replace the placeholder values with your actual Shopify store domain and Storefront API access token."
          >
            <CodeBlock lang=".env" code={ENV_EXAMPLE} />
            <div className="flex items-start gap-2 bg-charcoal-900 border border-charcoal-800/40 rounded px-3 py-2 text-xs text-cream-200/50 mt-1">
              <Key size={11} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>The domain is your <strong className="text-cream-200">myshopify.com</strong> address (not your custom domain). The token starts with <code className="font-mono bg-charcoal-800 px-1 rounded">shpat_</code></span>
            </div>
          </Step>

          <Step
            number={5}
            title="Get your Shopify product Variant IDs"
            description="Each product in this storefront needs to be linked to the corresponding Shopify product variant ID. Use the GraphiQL explorer in your Shopify Admin to get all variant IDs at once."
            link={{ label: 'Shopify GraphiQL Explorer', href: 'https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started' }}
          >
            <CodeBlock lang="GraphQL Query" code={GRAPHQL_EXAMPLE} />
          </Step>

          <Step
            number={6}
            title="Add shopifyVariantId to each product"
            description="In each product component file (ElectronicHumidors.tsx, DesktopHumidors.tsx, etc.), add the shopifyVariantId field to each product object in the products array. Use the IDs you got from the GraphQL query above."
          >
            <CodeBlock lang="TypeScript — product data" code={VARIANT_EXAMPLE} />
            <div className="mt-3 space-y-1">
              <p className="text-cream-200/40 text-[10px] tracking-widest uppercase">Files to update:</p>
              {[
                'src/components/ElectronicHumidors.tsx',
                'src/components/DesktopHumidors.tsx',
                'src/components/TravelHumidors.tsx',
                'src/components/CabinetHumidors.tsx',
                'src/components/Accessories.tsx',
                'src/components/NewArrivals.tsx',
                'src/components/FeaturedProducts.tsx',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-cream-200/50 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-600/60 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </Step>

          <Step
            number={7}
            title="Restart the dev server and test"
            description='Run "npm run dev" to restart the server with the new env vars. Add a product to cart — the "Checkout" button will appear in the cart drawer. Clicking it will create a Shopify cart and redirect you to your Shopify checkout page.'
          >
            <div className="space-y-2">
              {[
                { check: 'Cart drawer shows "CHECKOUT" button', ok: true },
                { check: 'Clicking checkout redirects to your-store.myshopify.com/checkouts/...', ok: true },
                { check: 'Items, quantities and prices match in Shopify checkout', ok: true },
                { check: 'Shopify handles payment, email confirmation, and order management', ok: true },
              ].map(({ check }) => (
                <div key={check} className="flex items-start gap-2 text-xs text-cream-200/60">
                  <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  {check}
                </div>
              ))}
            </div>
          </Step>
        </div>

        {/* FAQ */}
        <div className="mt-16 pt-10 border-t border-charcoal-800/40">
          <h2 className="font-serif text-2xl text-white font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What happens if a product has no shopifyVariantId?',
                a: 'It will still be added to the cart locally. At checkout, only items with a valid shopifyVariantId are sent to Shopify. Items without one are skipped — so make sure every product you want to sell has one linked.',
              },
              {
                q: 'Can customers check out without a Shopify account?',
                a: "Yes. Shopify supports guest checkout by default. Customers don't need a Shopify account — they just enter their email and payment details on the Shopify-hosted checkout page.",
              },
              {
                q: 'Will inventory be tracked automatically?',
                a: "Yes — if you enable inventory tracking in Shopify Admin for each product. Shopify will handle stock levels, out-of-stock messages, and prevent overselling during checkout.",
              },
              {
                q: 'What payment methods will customers see?',
                a: "Whatever you've configured in your Shopify store: credit cards via Shopify Payments, PayPal, Apple Pay, Google Pay, buy-now-pay-later options, etc. All handled by Shopify.",
              },
              {
                q: 'Can I keep the local checkout as a fallback?',
                a: 'Yes — the local checkout page is still present. If Shopify is not configured or the API call fails, the cart drawer automatically falls back to the local checkout flow.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg p-5">
                <p className="text-cream-100 text-sm font-semibold mb-2">{q}</p>
                <p className="text-cream-200/55 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase px-8 py-4 rounded hover:opacity-90 transition-opacity"
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
