// ─── Config ───────────────────────────────────────────────────────────────────

const STOREFRONT_ENDPOINT = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string;

export const shopifyConfigured = !!(
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN &&
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
);

// ─── Legacy config helpers (used by ShopifyConnect UI) ───────────────────────
// Credentials are now sourced from env vars; these are kept for UI compatibility.

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
      products(first: $first, after: $after) {
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
              id title
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
    { input: { lines } },
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

// ─── Legacy helper kept for Checkout component compatibility ──────────────────

export async function createShopifyCheckout(
  lines: { variantId: string; quantity: number }[],
): Promise<string> {
  const cart = await cartCreate(
    lines.map(({ variantId, quantity }) => ({ merchandiseId: variantId, quantity })),
  );
  return cart.checkoutUrl;
}
