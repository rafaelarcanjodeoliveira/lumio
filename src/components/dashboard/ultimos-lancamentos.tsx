import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/format";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";

type UltimosLancamentosProps = {
  lancamentos: LancamentoComCategoria[];
};

export function UltimosLancamentos({ lancamentos }: UltimosLancamentosProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-[12px] font-medium text-text-primary">
        Últimos lançamentos
      </h2>

      {lancamentos.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhum lançamento neste mês.</p>
      ) : (
        <div className="flex flex-col">
          {lancamentos.map((lancamento) => (
            <div
              key={lancamento.id}
              className="flex items-center justify-between border-b border-border-soft py-2 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: lancamento.categorias?.cor ?? "#888780",
                  }}
                />
                <div>
                  <p className="text-[13px] text-text-primary">
                    {lancamento.descricao}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {lancamento.categorias?.nome ?? "Sem categoria"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-[13px] font-medium ${
                    lancamento.tipo === "entrada"
                      ? "text-income"
                      : "text-expense"
                  }`}
                >
                  {lancamento.tipo === "entrada" ? "+ " : "− "}
                  {formatCurrency(lancamento.valor)}
                </p>
                <p className="text-[11px] text-text-muted">
                  {format(parseISO(lancamento.data), "dd/MM")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
