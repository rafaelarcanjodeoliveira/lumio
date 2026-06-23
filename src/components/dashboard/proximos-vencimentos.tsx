import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { formatCurrency } from "@/lib/format";
import type { ProximoVencimento } from "@/lib/dashboard/calculations";

type ProximosVencimentosProps = {
  vencimentos: ProximoVencimento[];
};

const LIMITE = 3;

export function ProximosVencimentos({
  vencimentos,
}: ProximosVencimentosProps) {
  const itens = vencimentos.slice(0, LIMITE);

  return (
    <div>
      <SectionHeader
        title="Próximos vencimentos"
        linkLabel="Ver todos"
        linkHref="/lancamentos"
      />
      <Card>
        {itens.length === 0 ? (
          <p className="text-sm text-text-muted">
            Nenhuma saída provisionada neste mês.
          </p>
        ) : (
          <div className="flex flex-col">
            {itens.map((vencimento) => (
              <div
                key={vencimento.id}
                className="flex items-center justify-between gap-2 border-b border-border-soft py-2 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: vencimento.categorias?.cor ?? "#888780",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-text-primary">
                      {vencimento.descricao}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      {format(parseISO(vencimento.data), "dd/MM")} ·{" "}
                      {vencimento.diasRestantes < 0
                        ? `${Math.abs(vencimento.diasRestantes)}d atrasado`
                        : vencimento.diasRestantes === 0
                          ? "hoje"
                          : `${vencimento.diasRestantes}d`}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="whitespace-nowrap text-[13px] font-semibold tracking-tight text-expense">
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
    </div>
  );
}
