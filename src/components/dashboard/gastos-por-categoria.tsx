import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { GastoPorCategoria } from "@/lib/dashboard/calculations";

type GastosPorCategoriaProps = {
  gastos: GastoPorCategoria[];
};

export function GastosPorCategoria({ gastos }: GastosPorCategoriaProps) {
  return (
    <Card>
      <h2 className="mb-3 text-[12px] font-medium text-text-primary">
        Gastos por categoria
      </h2>

      {gastos.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nenhuma saída registrada neste mês.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {gastos.map((gasto) => (
            <div key={gasto.categoriaId}>
              <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
                <span className="min-w-0 truncate text-text-secondary">
                  {gasto.nome}
                </span>
                <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
                  {formatCurrency(gasto.valor)}{" "}
                  <span className="text-text-muted">
                    · {gasto.percentual.toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-soft">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(gasto.percentual, 100)}%`,
                    backgroundColor: gasto.cor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
