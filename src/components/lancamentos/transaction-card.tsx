import type { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/format";

type TransactionCardProps = {
  descricao: string;
  categoriaNome?: string | null;
  categoriaCor?: string | null;
  data: string;
  tipo: "entrada" | "saida";
  status: "realizado" | "provisionado";
  valor: number;
  parcelaInfo?: string;
  actions?: ReactNode;
};

export function TransactionCard({
  descricao,
  categoriaNome,
  categoriaCor,
  data,
  tipo,
  status,
  valor,
  parcelaInfo,
  actions,
}: TransactionCardProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border-soft px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: categoriaCor ?? "#888780" }}
        />
        <div className="min-w-0">
          <p className="truncate text-[13px] text-text-primary">
            {descricao}
          </p>
          <p className="truncate text-[11px] text-text-muted">
            {categoriaNome ?? "Sem categoria"}
            {parcelaInfo ? ` · ${parcelaInfo}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="text-left sm:text-right">
          <p
            className={`whitespace-nowrap text-[13px] font-medium ${
              tipo === "entrada" ? "text-income" : "text-expense"
            }`}
          >
            {tipo === "entrada" ? "+ " : "− "}
            {formatCurrency(valor)}
          </p>
          <p className="whitespace-nowrap text-[11px] text-text-muted">
            {format(parseISO(data), "dd/MM")} ·{" "}
            <span
              className={
                status === "realizado" ? "text-income-text" : "text-brand-text"
              }
            >
              {status === "realizado" ? "Realizado" : "Provisionado"}
            </span>
          </p>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </div>
    </div>
  );
}
