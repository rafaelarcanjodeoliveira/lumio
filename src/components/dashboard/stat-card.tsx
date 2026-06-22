import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type StatCardProps = {
  label: string;
  valor: number;
  icon: LucideIcon;
  valueClassName?: string;
  highlight?: boolean;
};

export function StatCard({
  label,
  valor,
  icon: Icon,
  valueClassName,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={`min-w-0 rounded-xl border bg-surface p-3.5 shadow-card ${
        highlight ? "border-brand" : "border-border"
      }`}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] text-text-muted">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <p
        className={`truncate text-lg font-medium sm:text-xl ${valueClassName ?? "text-text-primary"}`}
        title={formatCurrency(valor)}
      >
        {formatCurrency(valor)}
      </p>
    </div>
  );
}
