import { Clock, Coins } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type MiniCardsProps = {
  provisionadoLiquido: number;
  disponivelHoje: number;
};

export function MiniCards({
  provisionadoLiquido,
  disponivelHoje,
}: MiniCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-card">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-text-muted">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Provisionado</span>
        </div>
        <p
          className="truncate text-base font-semibold tracking-tight text-brand-text"
          title={formatCurrency(provisionadoLiquido)}
        >
          {formatCurrency(provisionadoLiquido)}
        </p>
        <p className="mt-0.5 text-[10px] text-text-muted">líquido pendente</p>
      </div>

      <div className="min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-card">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-text-muted">
          <Coins className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Disponível hoje</span>
        </div>
        <p
          className="truncate text-base font-semibold tracking-tight text-text-primary"
          title={formatCurrency(disponivelHoje)}
        >
          {formatCurrency(disponivelHoje)}
        </p>
        <p className="mt-0.5 text-[10px] text-text-muted">após venc. de hoje</p>
      </div>
    </div>
  );
}
