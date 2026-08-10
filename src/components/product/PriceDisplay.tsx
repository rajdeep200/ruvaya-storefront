import { calcDiscountPercent, formatInr } from "@/lib/formatting";
import type { Money } from "@/types";

type PriceDisplayProps = {
  price: Money;
  salePrice: Money | null;
  size?: "sm" | "lg";
  variant?: "inline" | "compact";
};

export function PriceDisplay({ price, salePrice, size = "sm", variant = "inline" }: PriceDisplayProps) {
  const discount = calcDiscountPercent(price.amount, salePrice?.amount);
  const textSize = size === "lg" ? "text-xl" : "text-sm";

  if (salePrice && discount) {
    if (variant === "compact") {
      return (
        <div className="flex flex-col leading-tight">
          <span className={`${textSize} font-medium text-text-primary whitespace-nowrap`}>
            {formatInr(salePrice.amount)}
          </span>
          <span className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xs text-text-muted line-through">{formatInr(price.amount)}</span>
            <span className="text-xs font-medium text-success">{discount}% off</span>
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-2">
        <span className={`${textSize} font-medium text-text-primary`}>{formatInr(salePrice.amount)}</span>
        <span className="text-sm text-text-muted line-through">{formatInr(price.amount)}</span>
        <span className="text-xs font-medium text-success whitespace-nowrap">{discount}% off</span>
      </div>
    );
  }

  return <span className={`${textSize} font-medium text-text-primary`}>{formatInr(price.amount)}</span>;
}
