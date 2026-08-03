const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(amount: number): string {
  return inrFormatter.format(amount);
}

export function calcDiscountPercent(regular: number, sale: number | null | undefined): number | null {
  if (!sale || sale >= regular || regular <= 0) return null;
  return Math.round(((regular - sale) / regular) * 100);
}
