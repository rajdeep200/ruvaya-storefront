import { formatDateTime } from "@/lib/formatting";
import type { OrderTimelineStep } from "@/types";

export function OrderTimeline({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={`absolute left-[9px] top-5 h-full w-px ${step.completed ? "bg-primary" : "bg-border"}`}
            />
          )}
          <span
            aria-hidden="true"
            className={`z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${
              step.completed ? "border-primary bg-primary" : "border-border bg-surface"
            }`}
          />
          <div>
            <p className={`text-sm font-medium ${step.completed ? "text-text-primary" : "text-text-muted"}`}>
              {step.label}
            </p>
            {step.timestamp && <p className="text-xs text-text-muted">{formatDateTime(step.timestamp)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
