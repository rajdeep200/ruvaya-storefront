import { calcDiscountPercent, formatInr } from "@/lib/formatting";
import type { Money } from "@/types";

type PriceDisplayProps = {
  price: Money;
  salePrice: Money | null;
  size?: "sm" | "lg";
};

export function PriceDisplay({ price, salePrice, size = "sm" }: PriceDisplayProps) {
  const discount = calcDiscountPercent(price.amount, salePrice?.amount);
  const textSize = size === "lg" ? "text-xl" : "text-sm";

  if (salePrice && discount) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`${textSize} font-medium text-text-primary`}>{formatInr(salePrice.amount)}</span>
        <span className="text-sm text-text-muted line-through">{formatInr(price.amount)}</span>
        <span className="text-xs font-medium text-success">{discount}% off</span>
      </div>
    );
  }

  return <span className={`${textSize} font-medium text-text-primary`}>{formatInr(price.amount)}</span>;
}
