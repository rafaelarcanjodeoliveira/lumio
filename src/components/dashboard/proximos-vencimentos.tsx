import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { ProximoVencimento } from "@/lib/dashboard/calculations";

type ProximosVencimentosProps = {
  vencimentos: ProximoVencimento[];
};

export function ProximosVencimentos({
  vencimentos,
}: ProximosVencimentosProps) {
  return (
    <Card>
      <h2 className="mb-3 text-[12px] font-medium text-text-primary">
        Próximos vencimentos
      </h2>

      {vencimentos.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nenhum lançamento provisionado neste mês.
        </p>
      ) : (
        <div className="flex flex-col">
          {vencimentos.map((vencimento) => (
            <div
              key={vencimento.id}
              className="flex items-center justify-between border-b border-border-soft py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-text-primary">
                  {vencimento.descricao}
                </p>
                <p className="truncate text-[11px] text-text-muted">
                  {format(parseISO(vencimento.data), "dd/MM")} ·{" "}
                  {vencimento.diasRestantes < 0
                    ? `${Math.abs(vencimento.diasRestantes)}d atrasado`
                    : vencimento.diasRestantes === 0
                      ? "vence hoje"
                      : `${vencimento.diasRestantes}d`}
                </p>
              </div>
              <div className="shrink-0 pl-2 text-right">
                <p
                  className={`whitespace-nowrap text-[14px] font-semibold tracking-tight ${
                    vencimento.tipo === "entrada"
                      ? "text-income"
                      : "text-expense"
                  }`}
                >
                  {vencimento.tipo === "entrada" ? "+ " : "− "}
                  {formatCurrency(vencimento.valor)}
                </p>
                <span
                  className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    vencimento.urgente
                      ? "bg-expense-soft text-expense"
                      : "bg-brand-soft text-brand-text"
                  }`}
                >
                  {vencimento.urgente ? "urgente" : "pendente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
