import { StarRating } from "./StarRating";
import type { RatingSummary } from "@/types";

type ReviewSummaryProps = {
  summary: RatingSummary;
  /** "row" (default) sits the average beside the bars on larger screens — used on the standalone reviews page. "stack" always stacks them — used inside the product page's review card. */
  layout?: "row" | "stack";
};

export function ReviewSummary({ summary, layout = "row" }: ReviewSummaryProps) {
  const distribution = summary.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className={`flex flex-col gap-6 ${layout === "row" ? "sm:flex-row sm:items-center" : ""}`}>
      <div className={layout === "row" ? "text-center sm:text-left" : "flex flex-col items-center gap-2 text-center"}>
        <p className={`font-serif text-text-primary ${layout === "stack" ? "text-6xl" : "text-4xl"}`}>
          {summary.average.toFixed(1)}
        </p>
        <StarRating
          rating={summary.average}
          size={layout === "stack" ? 26 : 16}
          className={`mt-1 justify-center ${layout === "row" ? "sm:justify-start" : ""}`}
        />
        <p className="mt-1 text-xs text-text-muted">
          {summary.count} review{summary.count === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex-1 space-y-1">
        {([5, 4, 3, 2, 1] as const).map((star) => (
          <div key={star} className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="w-3">{star}</span>
            <div className="h-1.5 flex-1 rounded-full bg-surface-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${(distribution[star] / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-6 text-right">{distribution[star]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
