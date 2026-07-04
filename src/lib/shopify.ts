// ─── Config ───────────────────────────────────────────────────────────────────

// Support both browser (import.meta.env) and Node.js (process.env) environments
const getEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key as keyof ImportMetaEnv];
  }
  return process.env[key];
};

const STOREFRONT_ENDPOINT = getEnv('VITE_SHOPIFY_STORE_DOMAIN')
  ? `https://${getEnv('VITE_SHOPIFY_STORE_DOMAIN')}/api/2024-01/graphql.json`
  : '';
const STOREFRONT_TOKEN = (getEnv('VITE_SHOPIFY_STOREFRONT_TOKEN') as string) || '';

export const shopifyConfigured = !!(
  getEnv('VITE_SHOPIFY_STORE_DOMAIN') &&
  getEnv('VITE_SHOPIFY_STOREFRONT_TOKEN')
);

// ─── Legacy config helpers (used by ShopifyConnect UI) ───────────────────────

export const SHOPIFY_STORAGE_KEY = 'dunns_shopify_config';

export type ShopifyConfig = { domain: string; token: string };

export function saveShopifyConfig(_config: ShopifyConfig) {
  // No-op: credentials come from env vars
}

export function clearShopifyConfig() {
  // No-op
}

type ShopNameResponse = { shop: { name: string } };

export async function testShopifyConnection(
  _config: ShopifyConfig,
): Promise<{ ok: boolean; shopName?: string; error?: string }> {
  try {
    const data = await storefrontFetch<ShopNameResponse>('{ shop { name } }');
    return { ok: true, shopName: data.shop.name };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Connection failed' };
  }
}

export function getShopifyConfigured(): boolean {
  return shopifyConfigured;
}

// ─── Core fetcher ────────────────────────────────────────────────────────────

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!STOREFRONT_ENDPOINT) {
    throw new Error(
      'Shopify Storefront API endpoint is not configured. ' +
        'Set VITE_SHOPIFY_STORE_DOMAIN in your environment.',
    );
  }
  if (!STOREFRONT_TOKEN) {
    throw new Error(
      'Shopify Storefront Access Token is not configured. ' +
        'Set VITE_SHOPIFY_STOREFRONT_TOKEN in your environment.',
    );
  }

  const res = await fetch(STOREFRONT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = { url: string; altText: string | null };

export type ShopifyProductVariant = {
  id: string;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  image: ShopifyImage | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
};

// ─── Shop Pay Wallet Types ────────────────────────────────────────────────────

export type ShopPayLineItem = {
  label: string;
  amount: string;
  quantity?: number;
};

export type ShopPayPaymentRequestInput = {
  lineItems: ShopPayLineItem[];
  shippingOptions?: Array<{
    label: string;
    amount: string;
  }>;
  discountApplications?: Array<{
    label: string;
    amount: string;
  }>;
  taxAmount?: string;
  subtotalAmount: string;
  totalAmount: string;
  currencyCode: string;
  countryCode: string;
};

export type ShopPayPaymentRequestSession = {
  token: string;
  sourceIdentifier: string;
  checkoutUrl: string;
};

export type ShopPayPaymentRequestSessionCreatePayload = {
  shopPayPaymentRequestSession: ShopPayPaymentRequestSession | null;
  userErrors: Array<{
    field: string[];
    message: string;
  }>;
};

export type ShopPayPaymentRequestReceipt = {
  token: string;
  processingStatusType: string;
};

export type ShopPayPaymentRequestSessionSubmitPayload = {
  paymentRequestReceipt: ShopPayPaymentRequestReceipt | null;
  userErrors: Array<{
    field: string[];
    message: string;
  }>;
};

// ─── Fragments ────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id handle title description descriptionHtml productType tags
    featuredImage { url altText }
    images(first: 5) { edges { node { url altText } } }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 10) {
      edges {
        node {
          id title availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
        }
      }
    }
  }
`;

function mapProduct(raw: Record<string, unknown>): ShopifyProduct {
  const variantEdges = (raw.variants as { edges: { node: Record<string, unknown> }[] }).edges;
  const imageEdges = (raw.images as { edges: { node: ShopifyImage }[] }).edges;
  return {
    id: raw.id as string,
    handle: raw.handle as string,
    title: raw.title as string,
    description: raw.description as string,
    descriptionHtml: raw.descriptionHtml as string,
    productType: raw.productType as string,
    tags: raw.tags as string[],
    featuredImage: raw.featuredImage as ShopifyImage | null,
    images: imageEdges.map((e) => e.node),
    priceRange: raw.priceRange as ShopifyProduct['priceRange'],
    variants: variantEdges.map((e) => ({
      id: e.node.id as string,
      title: e.node.title as string,
      availableForSale: e.node.availableForSale as boolean,
      price: e.node.price as Money,
      compareAtPrice: e.node.compareAtPrice as Money | null,
      image: e.node.image as ShopifyImage | null,
    })),
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

type ProductsResponse = {
  products: {
    edges: { node: Record<string, unknown>; cursor: string }[];
    pageInfo: { hasNextPage: boolean };
  };
};

export async function fetchProducts(
  first = 24,
  after?: string,
): Promise<{ products: ShopifyProduct[]; hasNextPage: boolean; endCursor: string | null }> {
  const data = await storefrontFetch<ProductsResponse>(
    `
    ${PRODUCT_FRAGMENT}
    query Products($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "status:active") {
        pageInfo { hasNextPage }
        edges { cursor node { ...ProductFields } }
      }
    }
  `,
    { first, after },
  );
  const edges = data.products.edges;
  return {
    products: edges.map((e) => mapProduct(e.node as Record<string, unknown>)),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: edges.length ? edges[edges.length - 1].cursor : null,
  };
}

export async function fetchProductsByTag(
  tag: string,
  first = 24,
): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<ProductsResponse>(
    `
    ${PRODUCT_FRAGMENT}
    query ProductsByTag($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        pageInfo { hasNextPage }
        edges { cursor node { ...ProductFields } }
      }
    }
  `,
    { first, query: `tag:"${tag}" AND status:active` },
  );
  return data.products.edges.map((e) => mapProduct(e.node as Record<string, unknown>));
}

export async function fetchProductsByPriceRange(
  minPrice: number,
  maxPrice: number,
  first = 50,
): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<ProductsResponse>(
    `
    ${PRODUCT_FRAGMENT}
    query ProductsByPrice($first: Int!) {
      products(first: $first, sortKey: PRICE, reverse: true, query: "status:active") {
        pageInfo { hasNextPage }
        edges { cursor node { ...ProductFields } }
      }
    }
  `,
    { first },
  );
  const all = data.products.edges.map((e) => mapProduct(e.node as Record<string, unknown>));
  return all.filter((p) => {
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    return price >= minPrice && price <= maxPrice;
  });
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontFetch<{ product: Record<string, unknown> | null }>(
    `
    ${PRODUCT_FRAGMENT}
    query ProductByHandle($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
  `,
    { handle },
  );
  return data.product ? mapProduct(data.product) : null;
}

// ─── Collections ──────────────────────────────────────────────────────────────

type CollectionsResponse = {
  collections: { edges: { node: Record<string, unknown> }[] };
};

export async function fetchCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await storefrontFetch<CollectionsResponse>(
    `
    ${PRODUCT_FRAGMENT}
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id handle title description
            image { url altText }
            products(first: 12) {
              edges { node { ...ProductFields } }
            }
          }
        }
      }
    }
  `,
    { first },
  );
  return data.collections.edges.map((e) => {
    const col = e.node as Record<string, unknown>;
    const prodEdges = (col.products as { edges: { node: Record<string, unknown> }[] }).edges;
    return {
      id: col.id as string,
      handle: col.handle as string,
      title: col.title as string,
      description: col.description as string,
      image: col.image as ShopifyImage | null,
      products: prodEdges.map((pe) => mapProduct(pe.node)),
    };
  });
}

export async function fetchCollectionByHandle(
  handle: string,
  productsFirst = 24,
): Promise<ShopifyCollection | null> {
  const data = await storefrontFetch<{ collection: Record<string, unknown> | null }>(
    `
    ${PRODUCT_FRAGMENT}
    query CollectionByHandle($handle: String!, $productsFirst: Int!) {
      collection(handle: $handle) {
        id handle title description
        image { url altText }
        products(first: $productsFirst) {
          edges { node { ...ProductFields } }
        }
      }
    }
  `,
    { handle, productsFirst },
  );
  if (!data.collection) return null;
  const col = data.collection;
  const prodEdges = (col.products as { edges: { node: Record<string, unknown> }[] }).edges;
  return {
    id: col.id as string,
    handle: col.handle as string,
    title: col.title as string,
    description: col.description as string,
    image: col.image as ShopifyImage | null,
    products: prodEdges.map((pe) => mapProduct(pe.node)),
  };
}

// Fetch products from a collection by collection ID (for recommendations)
export async function fetchCollectionProducts(
  collectionId: string,
  first = 8,
): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<{
    collection: { products: { edges: { node: Record<string, unknown> }[] } } | null;
  }>(
    `
    ${PRODUCT_FRAGMENT}
    query CollectionProducts($collectionId: ID!, $first: Int!) {
      collection(id: $collectionId) {
        products(first: $first) {
          edges { node { ...ProductFields } }
        }
      }
    }
  `,
    { collectionId, first },
  );
  if (!data.collection) return [];
  const prodEdges = data.collection.products.edges;
  return prodEdges.map((pe) => mapProduct(pe.node));
}

// ─── Cart types ───────────────────────────────────────────────────────────────

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: { title: string; featuredImage: ShopifyImage | null };
  };
  cost: { totalAmount: Money };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: Money; subtotalAmount: Money };
  lines: ShopifyCartLine[];
};

// ─── Cart fragment ────────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id title availableForSale
              price { amount currencyCode }
              product { title featuredImage { url altText } }
            }
          }
        }
      }
    }
  }
`;

function mapCart(raw: Record<string, unknown>): ShopifyCart {
  const lineEdges = (raw.lines as { edges: { node: Record<string, unknown> }[] }).edges;
  return {
    id: raw.id as string,
    checkoutUrl: raw.checkoutUrl as string,
    totalQuantity: raw.totalQuantity as number,
    cost: raw.cost as ShopifyCart['cost'],
    lines: lineEdges.map((e) => e.node as unknown as ShopifyCartLine),
  };
}

// ─── Cart mutations ───────────────────────────────────────────────────────────

export async function cartCreate(
  lines: { merchandiseId: string; quantity: number }[],
  buyerIdentity?: { email?: string; countryCode?: string },
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartCreate: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  }>(
    `
    ${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
    { input: { lines, buyerIdentity } },
  );
  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  return mapCart(data.cartCreate.cart);
}

export async function cartLinesAdd(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesAdd: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
    { cartId, lines },
  );
  if (data.cartLinesAdd.userErrors.length) throw new Error(data.cartLinesAdd.userErrors[0].message);
  return mapCart(data.cartLinesAdd.cart);
}

export async function cartLinesUpdate(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesUpdate: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
    { cartId, lines },
  );
  if (data.cartLinesUpdate.userErrors.length)
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  return mapCart(data.cartLinesUpdate.cart);
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: string[],
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesRemove: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
    { cartId, lineIds },
  );
  if (data.cartLinesRemove.userErrors.length)
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  return mapCart(data.cartLinesRemove.cart);
}

export async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{ cart: Record<string, unknown> | null }>(
    `
    ${CART_FRAGMENT}
    query FetchCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `,
    { cartId },
  );
  return data.cart ? mapCart(data.cart) : null;
}

// ─── Blog / Articles ──────────────────────────────────────────────────────────

export type ShopifyArticle = {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: ShopifyImage | null;
  author: { name: string };
  blog: { handle: string; title: string };
};

function mapArticle(a: Record<string, unknown>): ShopifyArticle {
  return {
    id: a.id as string,
    handle: a.handle as string,
    title: a.title as string,
    excerpt: (a.excerpt as string) || '',
    contentHtml: (a.contentHtml as string) || '',
    publishedAt: a.publishedAt as string,
    tags: (a.tags as string[]) || [],
    image: (a.image as ShopifyImage | null) ?? null,
    author: { name: ((a.authorV2 as Record<string, unknown>)?.name as string) || "Dunn's Journal" },
    blog: {
      handle: ((a.blog as Record<string, unknown>)?.handle as string) || '',
      title: ((a.blog as Record<string, unknown>)?.title as string) || '',
    },
  };
}

type ArticlesResponse = {
  articles: { edges: { node: Record<string, unknown> }[] };
};

export async function fetchArticles(first = 20): Promise<ShopifyArticle[]> {
  const data = await storefrontFetch<ArticlesResponse>(
    `
    query Articles($first: Int!) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id handle title excerpt contentHtml publishedAt tags
            image { url altText }
            authorV2 { name }
            blog { handle title }
          }
        }
      }
    }
  `,
    { first },
  );
  return data.articles.edges.map((e) => mapArticle(e.node as Record<string, unknown>));
}

type BlogArticleResponse = {
  blog: {
    handle: string;
    title: string;
    articleByHandle: Record<string, unknown> | null;
  } | null;
};

export async function fetchArticleByHandle(
  blogHandle: string,
  articleHandle: string,
): Promise<ShopifyArticle | null> {
  const data = await storefrontFetch<BlogArticleResponse>(
    `
    query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        handle title
        articleByHandle(handle: $articleHandle) {
          id handle title excerpt contentHtml publishedAt tags
          image { url altText }
          authorV2 { name }
          blog { handle title }
        }
      }
    }
  `,
    { blogHandle, articleHandle },
  );
  if (!data.blog?.articleByHandle) return null;
  return mapArticle(data.blog.articleByHandle);
}

// ─── Shipping Rates ───────────────────────────────────────────────────────────

// Determine carrier based on order value and product preference
function selectCarrierForOrder(orderValue: number, productCarrierPref?: string): { carrier: string; name: string } {
  // If product has explicit carrier preference, use it
  if (productCarrierPref) {
    const prefs: Record<string, string> = {
      'usps': 'Expert Concierge Delivery',
      'ups': 'Premium Delivery',
      'dhl': 'Express Delivery',
    };
    return { carrier: productCarrierPref.toUpperCase(), name: prefs[productCarrierPref] || productCarrierPref };
  }

  // Smart default based on order value
  // High-value items: Premium Delivery (more reliable for expensive products)
  // Standard items: Expert Concierge Delivery (emphasizes service for all items)
  if (orderValue >= 1500) {
    return { carrier: 'UPS', name: 'Premium Delivery' };
  }
  return { carrier: 'USPS', name: 'Expert Concierge Delivery' };
}

export async function getShippingRates(orderValue: number, _productHandle: string, productCarrierPref?: string) {
  // Rates based on order value from Shopify shipping zones
  let cost: string;

  if (orderValue >= 500) {
    cost = '230.00';
  } else if (orderValue >= 100) {
    cost = '45.00';
  } else {
    cost = '15.00';
  }

  // Calculate delivery date (carrier varies: USPS 3-5 days, UPS 2-4 days)
  const deliveryDate = new Date();
  const carrierData = selectCarrierForOrder(orderValue, productCarrierPref);
  const daysToAdd = carrierData.carrier === 'UPS' ? 4 : 6; // UPS slightly faster
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    cost,
    deliveryDate: formattedDate,
    carrier: carrierData.name,
  };
}

// ─── Shop Pay Wallet Session Management ───────────────────────────────────────

export async function shopPaySessionCreate(
  paymentRequest: ShopPayPaymentRequestInput,
  sourceIdentifier: string,
): Promise<ShopPayPaymentRequestSession> {
  const response = await fetch('/api/shop-pay-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentRequest, sourceIdentifier }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error?.error || `Failed to create Shop Pay session (${response.status})`);
  }

  const result = (await response.json()) as { token: string; checkoutUrl: string };
  return {
    token: result.token,
    sourceIdentifier,
    checkoutUrl: result.checkoutUrl,
  };
}

export async function shopPaySessionSubmit(
  token: string,
  paymentRequest: ShopPayPaymentRequestInput,
  idempotencyKey: string,
  orderName?: string,
): Promise<ShopPayPaymentRequestReceipt> {
  const response = await fetch('/api/shop-pay-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, paymentRequest, idempotencyKey, orderName }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error?.error || `Failed to submit Shop Pay payment (${response.status})`);
  }

  const result = (await response.json()) as { token: string; orderName: string };
  return {
    token: result.token,
    processingStatusType: 'PENDING',
  };
}

// ─── Legacy helper kept for Checkout component compatibility ──────────────────

export async function createShopifyCheckout(
  lines: { variantId: string; quantity: number }[],
): Promise<string> {
  const cart = await cartCreate(
    lines.map(({ variantId, quantity }) => ({ merchandiseId: variantId, quantity })),
  );
  return cart.checkoutUrl;
}
