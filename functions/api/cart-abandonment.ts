export interface Env {
  KLAVIYO_API_KEY: string;
}

interface CartAbandonmentPayload {
  email: string;
  firstName?: string;
  cartTotal: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  cartId?: string;
  cartUrl?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const payload = await request.json<CartAbandonmentPayload>();

    const { email, firstName, cartTotal, items, cartId, cartUrl } = payload;

    if (!email?.trim()) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.KLAVIYO_API_KEY) {
      console.error('KLAVIYO_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Track "Left Checkout" event in Klaviyo v2 Events API
    const eventData = {
      data: {
        type: 'event',
        attributes: {
          metric: {
            name: 'Left Checkout',
          },
          profile: {
            $email: email.trim(),
            ...(firstName?.trim() && { $first_name: firstName.trim() }),
          },
          value: cartTotal,
          unique_id: cartId || `cart_${Date.now()}`,
          properties: {
            ItemCount: items?.length || 0,
            CartURL: cartUrl || 'https://dunnluxuryselections.com/cart',
            Items: items?.map(item => ({
              ProductName: item.name,
              ProductPrice: item.price,
              Quantity: item.quantity,
            })) || [],
          },
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Send to Klaviyo v2 Events API
    const klaviyoResponse = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
        'revision': '2023-10-15',
      },
      body: JSON.stringify(eventData),
    });

    if (!klaviyoResponse.ok) {
      const errorText = await klaviyoResponse.text();
      console.error('Klaviyo API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to track cart abandonment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Cart abandonment email queued',
      tracked: true,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Cart abandonment function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
