import { useState, useEffect } from 'react';
import {
  Store,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  Link2,
  Link2Off,
  Trash2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import {
  saveShopifyConfig,
  clearShopifyConfig,
  testShopifyConnection,
  getShopifyConfigured,
  SHOPIFY_STORAGE_KEY,
  type ShopifyConfig,
} from '../lib/shopify';

type Status = 'idle' | 'testing' | 'success' | 'error';

export default function ShopifyConnect() {
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [shopName, setShopName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [connected, setConnected] = useState(false);
  const [savedDomain, setSavedDomain] = useState('');

  // Load existing saved config on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHOPIFY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ShopifyConfig;
        if (parsed.domain && parsed.token) {
          setDomain(parsed.domain);
          setToken(parsed.token);
          setSavedDomain(parsed.domain);
          setConnected(getShopifyConfigured());
        }
      }
    } catch { /* ignore */ }
  }, []);

  const normalizeDomain = (val: string) => {
    // Strip https:// and trailing slashes; ensure .myshopify.com suffix
    let d = val.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    return d;
  };

  const handleTest = async () => {
    const d = normalizeDomain(domain);
    if (!d || !token.trim()) {
      setStatus('error');
      setErrorMsg('Both store domain and access token are required.');
      return;
    }
    setStatus('testing');
    setErrorMsg('');
    const result = await testShopifyConnection({ domain: d, token: token.trim() });
    if (result.ok && result.shopName) {
      saveShopifyConfig({ domain: d, token: token.trim() });
      setSavedDomain(d);
      setShopName(result.shopName);
      setConnected(true);
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? 'Could not connect. Check your domain and token.');
    }
  };

  const handleDisconnect = () => {
    clearShopifyConfig();
    setConnected(false);
    setSavedDomain('');
    setShopName('');
    setDomain('');
    setToken('');
    setStatus('idle');
  };

  if (connected) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-semibold text-sm">Connected to Shopify</p>
              {shopName && (
                <p className="text-emerald-400/70 text-xs mt-0.5">{shopName}</p>
              )}
              <a
                href={`https://${savedDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400/60 text-[11px] hover:text-emerald-400 transition-colors flex items-center gap-1 mt-0.5"
              >
                {savedDomain} <ExternalLink size={10} />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-800/30 border border-emerald-700/30 rounded-full px-3 py-1">
              <Link2 size={11} className="text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-medium">Live</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 text-[11px] text-red-400/60 hover:text-red-400 transition-colors border border-red-700/30 hover:border-red-600/50 rounded-full px-3 py-1"
            >
              <Trash2 size={10} />
              Disconnect
            </button>
          </div>
        </div>
        <p className="text-emerald-300/50 text-xs mt-4 leading-relaxed">
          All checkouts from this storefront will be routed to your Shopify store. Customers are redirected to Shopify's secure checkout page where they can pay, and orders will appear in your Shopify Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-charcoal-800/40 flex items-center gap-3">
        <div className="w-9 h-9 bg-gold-700/20 border border-gold-600/20 rounded-lg flex items-center justify-center">
          <Store size={16} className="text-gold-400" />
        </div>
        <div>
          <p className="text-cream-100 text-sm font-semibold">Connect Your Shopify Store</p>
          <p className="text-cream-200/40 text-xs mt-0.5">Enter your credentials to link your store</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-cream-200/30 border border-charcoal-700/40 rounded-full px-3 py-1">
          <Link2Off size={10} />
          Not connected
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-5 space-y-4">
        {/* Domain */}
        <div>
          <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">
            Shopify Store Domain
          </label>
          <div className="relative">
            <Store size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
            <input
              type="text"
              placeholder="your-store.myshopify.com"
              value={domain}
              onChange={(e) => { setDomain(e.target.value); setStatus('idle'); }}
              className="w-full bg-charcoal-950 border border-charcoal-700/50 focus:border-gold-500/60 text-cream-100 text-sm rounded-lg pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-charcoal-500"
            />
          </div>
          <p className="text-cream-200/30 text-[10px] mt-1.5">
            Found in Shopify Admin &rarr; Settings &rarr; Domains. Use your <code className="font-mono bg-charcoal-800 px-1 rounded">.myshopify.com</code> address.
          </p>
        </div>

        {/* Token */}
        <div>
          <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">
            Storefront API Access Token
          </label>
          <div className="relative">
            <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
            <input
              type="password"
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => { setToken(e.target.value); setStatus('idle'); }}
              className="w-full bg-charcoal-950 border border-charcoal-700/50 focus:border-gold-500/60 text-cream-100 text-sm rounded-lg pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-charcoal-500 font-mono"
            />
          </div>
          <p className="text-cream-200/30 text-[10px] mt-1.5">
            From Shopify Admin &rarr; Apps &rarr; Develop Apps &rarr; your app &rarr; API credentials &rarr; Storefront API access token.
          </p>
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="flex items-start gap-2.5 bg-red-900/20 border border-red-700/40 rounded-lg px-4 py-3 text-xs text-red-300">
            <XCircle size={14} className="flex-shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Required scopes reminder */}
        <div className="flex items-start gap-2.5 bg-amber-900/15 border border-amber-700/25 rounded-lg px-4 py-3 text-xs text-amber-300/80">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>
            Your Storefront API app needs these scopes:{' '}
            <code className="font-mono bg-amber-900/30 px-1 rounded">unauthenticated_read_product_listings</code>{' '}
            and{' '}
            <code className="font-mono bg-amber-900/30 px-1 rounded">unauthenticated_write_checkouts</code>.
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleTest}
          disabled={status === 'testing' || !domain.trim() || !token.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'testing' ? (
            <><Loader2 size={15} className="animate-spin" /> Testing Connection...</>
          ) : (
            <><Link2 size={14} /> Test & Save Connection</>
          )}
        </button>

        <a
          href="https://admin.shopify.com/store/apps/development"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-cream-200/40 hover:text-gold-400 transition-colors py-1"
        >
          Open Shopify App Dashboard <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
