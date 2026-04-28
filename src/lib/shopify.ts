const ENV_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string;
const ENV_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string;

const PLACEHOLDER_DOMAIN = 'your-store.myshopify.com';
const PLACEHOLDER_TOKEN = 'your-storefront-access-token';

export const SHOPIFY_STORAGE_KEY = 'dunns_shopify_config';

export type ShopifyConfig = {
  domain: string;
  token: string;
};

function getConfig(): ShopifyConfig {
  // Prefer runtime localStorage config (set via UI), fall back to env vars
  try {
    const stored = localStorage.getItem(SHOPIFY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ShopifyConfig;
      if (parsed.domain && parsed.token) return parsed;
    }
  } catch { /* ignore */ }
  return { domain: ENV_DOMAIN ?? '', token: ENV_TOKEN ?? '' };
}

export function saveShopifyConfig(config: ShopifyConfig) {
  localStorage.setItem(SHOPIFY_STORAGE_KEY, JSON.stringify(config));
}

export function clearShopifyConfig() {
  localStorage.removeItem(SHOPIFY_STORAGE_KEY);
}

function isValidConfig(cfg: ShopifyConfig): boolean {
  return !!(
    cfg.domain &&
    cfg.domain !== PLACEHOLDER_DOMAIN &&
    cfg.token &&
    cfg.token !== PLACEHOLDER_TOKEN
  );
}

export function getShopifyConfigured(): boolean {
  return isValidConfig(getConfig());
}

// Re-export a computed value for components that read it at module load time
// (CartContext reads this once; use getShopifyConfigured() for live checks)
export const shopifyConfigured = getShopifyConfigured();

function getEndpoint(domain: string) {
  return `https://${domain}/api/2024-04/graphql.json`;
}

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  overrideConfig?: ShopifyConfig,
): Promise<T> {
  const cfg = overrideConfig ?? getConfig();
  const res = await fetch(getEndpoint(cfg.domain), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': cfg.token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShopifyCartLine = {
  variantId: string; // gid://shopify/ProductVariant/...
  quantity: number;
};

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string };
    userErrors: { field: string[]; message: string }[];
  };
};

type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: { id: string; checkoutUrl: string };
    userErrors: { field: string[]; message: string }[];
  };
};

// ─── Create cart and return checkout URL ──────────────────────────────────────

export async function createShopifyCheckout(lines: ShopifyCartLine[]): Promise<string> {
  const data = await storefrontFetch<CartCreateResponse>(`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `, {
    input: {
      lines: lines.map(({ variantId, quantity }) => ({
        merchandiseId: variantId,
        quantity,
      })),
    },
  });

  const errors = data.cartCreate.userErrors;
  if (errors.length) throw new Error(errors[0].message);
  return data.cartCreate.cart.checkoutUrl;
}

// ─── Add lines to existing cart ───────────────────────────────────────────────

export async function addLinesToCart(cartId: string, lines: ShopifyCartLine[]): Promise<string> {
  const data = await storefrontFetch<CartLinesAddResponse>(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `, {
    cartId,
    lines: lines.map(({ variantId, quantity }) => ({
      merchandiseId: variantId,
      quantity,
    })),
  });

  const errors = data.cartLinesAdd.userErrors;
  if (errors.length) throw new Error(errors[0].message);
  return data.cartLinesAdd.cart.checkoutUrl;
}

// ─── Test connection ──────────────────────────────────────────────────────────

type ShopNameResponse = { shop: { name: string; primaryDomain: { url: string } } };

export async function testShopifyConnection(
  config: ShopifyConfig,
): Promise<{ ok: boolean; shopName?: string; error?: string }> {
  try {
    const data = await storefrontFetch<ShopNameResponse>(
      `{ shop { name primaryDomain { url } } }`,
      undefined,
      config,
    );
    return { ok: true, shopName: data.shop.name };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Connection failed' };
  }
}

// ─── Fetch product variants by handle ────────────────────────────────────────

type ProductByHandleResponse = {
  productByHandle: {
    id: string;
    title: string;
    variants: {
      edges: {
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
        };
      }[];
    };
  } | null;
};

export async function getProductVariants(handle: string) {
  const data = await storefrontFetch<ProductByHandleResponse>(`
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id title
        variants(first: 10) {
          edges { node { id title price { amount currencyCode } availableForSale } }
        }
      }
    }
  `, { handle });
  return data.productByHandle;
}
