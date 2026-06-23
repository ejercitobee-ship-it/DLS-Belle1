import { useCallback } from 'react';

/**
 * Custom hook for navigating to product pages in the SPA.
 * Dispatches a custom event that the main App routing system listens for.
 * Prevents default link behavior and uses history.pushState for proper SPA navigation.
 *
 * @param productHandle - Non-empty product identifier (e.g., "elite-humidor-3000").
 *                        Empty or whitespace-only values are silently ignored.
 * @returns A callback function that navigates to the specified product page.
 *
 * @example
 * const navigateToProduct = useNavigateToProduct();
 * navigateToProduct('humidor-handle'); // Navigates to product page
 */
export function useNavigateToProduct(): (productHandle: string) => void {
  return useCallback((productHandle: string) => {
    // Validate productHandle is non-empty
    if (!productHandle || !productHandle.trim()) {
      console.warn('useNavigateToProduct: productHandle is required and cannot be empty');
      return;
    }

    // Dispatch custom event that App.tsx listens for
    window.dispatchEvent(
      new CustomEvent('navigate-product', {
        detail: { productHandle: productHandle.trim() },
      })
    );
  }, []);
}
