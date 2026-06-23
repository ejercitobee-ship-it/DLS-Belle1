import { useCallback } from 'react';

/**
 * Custom hook for navigating to product pages in the SPA.
 * Dispatches a custom event that the main App routing system listens for.
 * Prevents default link behavior and uses history.pushState for proper SPA navigation.
 */
export function useNavigateToProduct() {
  return useCallback((productHandle: string) => {
    // Dispatch custom event that App.tsx listens for
    window.dispatchEvent(
      new CustomEvent('navigate-product', {
        detail: { productHandle },
      })
    );
  }, []);
}
