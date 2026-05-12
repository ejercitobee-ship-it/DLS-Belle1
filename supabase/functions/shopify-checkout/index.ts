import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SHOPIFY_DOMAIN = "luxury-dunn-selections.myshopify.com";
const STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_TOKEN") ?? "68ba4d5231bfe1cc188916fc62fa8882";

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

async function shopifyFetch(query: string, variables: Record<string, unknown>) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { lines } = await req.json() as {
      lines: { merchandiseId: string; quantity: number }[];
    };

    if (!lines?.length) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await shopifyFetch(
      `${CART_FRAGMENT}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ...CartFields }
          userErrors { message }
        }
      }`,
      { input: { lines } },
    );

    if (data.cartCreate.userErrors?.length) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    const checkoutUrl: string = data.cartCreate.cart.checkoutUrl;
    const cartId: string = data.cartCreate.cart.id;

    // Return the checkout URL — client will navigate to it
    // The URL is on the custom domain (dunnluxuryselections.com) but the
    // /cart/c/ path is a Shopify-owned checkout that Shopify serves, not the SPA.
    // The _redirects proxy rule forwards /cart/* to Shopify's backend.
    return new Response(
      JSON.stringify({ checkoutUrl, cartId }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
