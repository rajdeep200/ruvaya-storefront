import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <SearchX size={48} strokeWidth={1.2} className="text-primary/60" aria-hidden="true" />
      <h2 className="mt-5 font-serif text-xl text-text-primary">{title}</h2>
      {description && <p className="mt-2 text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
