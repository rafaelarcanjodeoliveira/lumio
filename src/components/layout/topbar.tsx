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
    <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
      <div>
        <h1 className="text-sm font-medium text-text-primary">{title}</h1>
        {subtitle && (
          <p className="mt-px text-[11px] text-text-muted">{subtitle}</p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-medium text-brand-dark"
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel}
        </Link>
      )}
    </header>
  );
}
