import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-1.5 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-soft text-text-faint">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      {description && (
        <p className="max-w-xs text-[12px] text-text-muted">{description}</p>
      )}
    </div>
  );
}
