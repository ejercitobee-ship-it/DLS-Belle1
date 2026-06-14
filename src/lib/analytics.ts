export function trackAddToCart(itemName: string, price: number, productHandle: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productHandle,
        item_name: itemName,
        price: price,
      }],
    });
  }
}

export function trackProceedToCheckout(cartTotal: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: cartTotal,
    });
  }
}

export function trackShippingCalculatorUsed(zipCode: string, shippingCost: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'custom_shipping_calculator', {
      zip_code_region: zipCode.charAt(0),
      shipping_cost: shippingCost,
    });
  }
}

export function trackExpertChatClick() {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'expert_chat_click', {
      engagement_type: 'chat',
    });
  }
}

export function trackPurchase(orderId: string, totalValue: number, itemCount: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: totalValue,
      items: [{
        quantity: itemCount,
      }],
    });
  }
}
