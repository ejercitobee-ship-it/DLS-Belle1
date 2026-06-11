// Affirm financing offer shown across product, cart, and checkout surfaces.
// Offer: 0% interest, 4 monthly payments. Only shown on orders/items over the minimum.

export const FINANCING_MIN = 1500;
export const FINANCING_TERM_MONTHS = 4;

export function qualifiesForFinancing(priceNum: number): boolean {
  return priceNum >= FINANCING_MIN;
}

export function monthlyPayment(priceNum: number): number {
  return priceNum / FINANCING_TERM_MONTHS;
}

export function formatMonthlyPayment(priceNum: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(monthlyPayment(priceNum));
}
