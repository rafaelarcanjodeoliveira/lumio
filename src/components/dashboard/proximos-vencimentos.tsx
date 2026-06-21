import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/format";
import type { ProximoVencimento } from "@/lib/dashboard/calculations";

type ProximosVencimentosProps = {
  vencimentos: ProximoVencimento[];
};

export function ProximosVencimentos({
  vencimentos,
}: ProximosVencimentosProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
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
              <div>
                <p className="text-[13px] text-text-primary">
                  {vencimento.descricao}
                </p>
                <p className="text-[11px] text-text-muted">
                  {format(parseISO(vencimento.data), "dd/MM")} ·{" "}
                  {vencimento.diasRestantes < 0
                    ? `${Math.abs(vencimento.diasRestantes)}d atrasado`
                    : vencimento.diasRestantes === 0
                      ? "vence hoje"
                      : `${vencimento.diasRestantes}d`}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-[13px] font-medium ${
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
    </div>
  );
}
