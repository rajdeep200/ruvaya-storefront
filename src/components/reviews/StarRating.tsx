import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, size = 14, className }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`flex items-center gap-0.5 text-primary ${className ?? ""}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.2}
          fill={i < rounded ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
