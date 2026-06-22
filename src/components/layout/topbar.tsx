import Link from "next/link";
import { Plus } from "lucide-react";

type TopbarProps = {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function Topbar({ title, subtitle, actionHref, actionLabel }: TopbarProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-sm font-medium text-text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-px truncate text-[11px] text-text-muted">
            {subtitle}
          </p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="tap-target inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand px-3.5 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-hover"
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          {actionLabel}
        </Link>
      )}
    </header>
  );
}
