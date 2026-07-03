import { useEffect, useRef } from 'react';
import { shopPaySessionSubmit } from '../lib/shopify';
import type { ShopPayPaymentRequestInput } from '../lib/shopify';

/**
 * Hook that handles Shop Pay payment confirmation after customer completes payment.
 * When Shop Pay redirects back, this hook submits the final payment request to confirm the transaction.
 */
export function useShopPayConfirmation() {
  const confirmationInProgress = useRef(false);

  useEffect(() => {
    // Prevent double-submission
    if (confirmationInProgress.current) return;

    const handleConfirmation = async () => {
      try {
        // Get Shop Pay session data from sessionStorage (set by createShopPaySession)
        const sessionData = sessionStorage.getItem('shopPaySession');
        if (!sessionData) return;

        const { token, paymentRequest } = JSON.parse(sessionData);
        if (!token || !paymentRequest) return;

        confirmationInProgress.current = true;

        // Generate stable idempotency key to prevent duplicate charges on retry
        const idempotencyKey = `${token}-${Math.floor(Date.now() / 1000)}`;

        // Generate order name from current timestamp
        const orderName = `DUNN-${new Date().getTime()}`;

        // Submit payment confirmation
        const receipt = await shopPaySessionSubmit(
          token,
          paymentRequest as ShopPayPaymentRequestInput,
          idempotencyKey,
          orderName,
        );

        // Log success for debugging
        console.log('Shop Pay payment confirmed:', receipt);

        // Clear session data after successful confirmation
        sessionStorage.removeItem('shopPaySession');

        // Redirect to order confirmation page (Shopify should handle this via return_url)
        // But we can force it here if needed
        if (!window.location.pathname.includes('order-confirmation')) {
          window.location.href = '/order-confirmation';
        }
      } catch (error) {
        console.error('Shop Pay confirmation error:', error);
        // On error, redirect to error page or checkout with error message
        const message = error instanceof Error ? error.message : 'Payment confirmation failed';
        window.location.href = `/checkout?error=${encodeURIComponent(message)}`;
      }
    };

    // Only run confirmation if we detect Shop Pay session data
    const sessionData = sessionStorage.getItem('shopPaySession');
    if (sessionData && !confirmationInProgress.current) {
      handleConfirmation();
    }
  }, []);
}
