export interface Env {
  VITE_SHOPIFY_STORE_DOMAIN: string;
  VITE_SHOPIFY_SHOP_PAY_CLIENT_ID: string;
  VITE_SHOPIFY_SHOP_PAY_SECRET: string;
}

interface ShopPayLineItem {
  label: string;
  amount: string;
  quantity: number;
}

interface ShopPayPaymentRequest {
  lineItems: ShopPayLineItem[];
  subtotalAmount: string;
  totalAmount: string;
  currencyCode: string;
  countryCode: string;
}

interface SessionRequest {
  paymentRequest: ShopPayPaymentRequest;
  sourceIdentifier: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { paymentRequest, sourceIdentifier } = await request.json<SessionRequest>();

    // Validate environment variables
    if (!env.VITE_SHOPIFY_STORE_DOMAIN) {
      return new Response(JSON.stringify({ error: 'Store domain not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.VITE_SHOPIFY_SHOP_PAY_CLIENT_ID || !env.VITE_SHOPIFY_SHOP_PAY_SECRET) {
      console.error('Shop Pay credentials not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Get OAuth access token using Client ID + Secret
    const tokenUrl = 'https://shopify.com/admin/oauth/access_token';
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.VITE_SHOPIFY_SHOP_PAY_CLIENT_ID,
        client_secret: env.VITE_SHOPIFY_SHOP_PAY_SECRET,
        grant_type: 'client_credentials',
        scope: 'shopify_pay_wallet_api',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('OAuth token error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to authenticate with Shopify' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tokenData = await tokenResponse.json<{ access_token: string }>();
    const accessToken = tokenData.access_token;

    // Step 2: Call Shop Pay Wallet API mutation using access token
    const shopifyUrl = `https://${env.VITE_SHOPIFY_STORE_DOMAIN}/admin/graphql.json`;

    const mutation = `
      mutation CreateShopPaySession($input: ShopPayPaymentRequestSessionCreateInput!) {
        shopPayPaymentRequestSessionCreate(input: $input) {
          shopPayPaymentRequestSession {
            token
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        paymentRequest: {
          lineItems: paymentRequest.lineItems.map(item => ({
            label: item.label,
            amount: item.amount,
            quantity: item.quantity,
          })),
          subtotalAmount: paymentRequest.subtotalAmount,
          totalAmount: paymentRequest.totalAmount,
          currencyCode: paymentRequest.currencyCode,
          countryCode: paymentRequest.countryCode,
        },
        sourceIdentifier,
      },
    };

    const shopifyResponse = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to create Shop Pay session' }), {
        status: shopifyResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await shopifyResponse.json<{
      data?: {
        shopPayPaymentRequestSessionCreate?: {
          shopPayPaymentRequestSession?: {
            token: string;
            checkoutUrl: string;
          };
          userErrors?: Array<{ field?: string; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>();

    // Check for GraphQL errors
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return new Response(
        JSON.stringify({ error: 'Failed to create Shop Pay session', details: result.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Check for user errors
    const session = result.data?.shopPayPaymentRequestSessionCreate?.shopPayPaymentRequestSession;
    const userErrors = result.data?.shopPayPaymentRequestSessionCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      console.error('Shop Pay user errors:', userErrors);
      return new Response(
        JSON.stringify({
          error: 'Failed to create Shop Pay session',
          details: userErrors.map(e => e.message).join(', '),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (!session) {
      return new Response(JSON.stringify({ error: 'No session returned from Shop Pay' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ token: session.token, checkoutUrl: session.checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Shop Pay session function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
