import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "";

  // If it's already a formatted string (contains dots), try to parse it specifically for TR locale check or just return if it looks right?
  // Listing.price is a string in DB. Listing.priceNumeric is number. 
  // Best to rely on priceNumeric if available, otherwise try to parse string.

  const num = typeof amount === 'string'
    ? parseFloat(amount.replace(/\./g, '').replace(/,/g, '.'))
    : amount;

  if (isNaN(num)) return amount?.toString() || "";

  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
