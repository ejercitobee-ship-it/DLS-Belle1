/**
 * Creates a debounced version of a function that delays execution
 * until it hasn't been called for the specified delay period.
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced function that also has a `flush` method to execute immediately
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): T & { flush: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;

  const debounced = function (...args: any[]) {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...lastArgs!);
      timeoutId = null;
      lastArgs = null;
    }, delay);
  };

  debounced.flush = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      if (lastArgs !== null) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }
  };

  return debounced as T & { flush: () => void };
}
