/**
 * Format price in Indian Rupees with comma separators (e.g., 1,25,000)
 */
export function formatPriceInINR(amount: number): string {
  return Math.round(amount).toLocaleString("en-IN");
}
