"use client";

import { useRouter } from "next/navigation";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { GastoPorCategoria } from "@/lib/dashboard/calculations";

type GastosCategoriaTabProps = {
  mes: number;
  ano: number;
  gastos: GastoPorCategoria[];
};

export function GastosCategoriaTab({
  mes,
  ano,
  gastos,
}: GastosCategoriaTabProps) {
  const router = useRouter();
  const referencia = new Date(ano, mes - 1, 1);
  const mesLabel = format(referencia, "MMMM yyyy", { locale: ptBR });

  function irParaMes(delta: number) {
    const novaData = addMonths(referencia, delta);
    router.push(
      `/relatorios?mes=${novaData.getMonth() + 1}&ano=${novaData.getFullYear()}`,
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => irParaMes(-1)}
          className="rounded-md border border-border p-1.5 text-text-muted hover:bg-neutral-soft"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[130px] text-center text-[13px] font-medium text-text-primary capitalize">
          {mesLabel}
        </span>
        <button
          type="button"
          onClick={() => irParaMes(1)}
          className="rounded-md border border-border p-1.5 text-text-muted hover:bg-neutral-soft"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Card>
        {gastos.length === 0 ? (
          <p className="text-sm text-text-muted">
            Nenhuma saída registrada neste mês.
          </p>
        ) : (
          <>
            <ResponsiveContainer
              width="100%"
              height={Math.max(gastos.length * 36, 120)}
            >
              <BarChart data={gastos} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--color-border-soft)"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  tickFormatter={(valor: number) => formatCurrency(valor)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={90}
                  tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "var(--color-border)",
                    fontSize: 12,
                  }}
                  formatter={(valor) => formatCurrency(Number(valor))}
                />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                  {gastos.map((gasto) => (
                    <Cell key={gasto.categoriaId} fill={gasto.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="-mx-4 mt-4 overflow-x-auto px-4">
              <table className="w-full min-w-[320px] text-[13px]">
                <thead>
                  <tr className="border-b border-border-soft text-left text-[11px] text-text-muted">
                    <th className="py-2 font-medium">Categoria</th>
                    <th className="py-2 text-right font-medium">Total</th>
                    <th className="py-2 text-right font-medium">
                      % do total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto) => (
                    <tr
                      key={gasto.categoriaId}
                      className="border-b border-border-soft last:border-b-0"
                    >
                      <td className="py-2 text-text-primary">
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: gasto.cor }}
                        />
                        {gasto.nome}
                      </td>
                      <td className="py-2 whitespace-nowrap text-right text-text-primary">
                        {formatCurrency(gasto.valor)}
                      </td>
                      <td className="py-2 text-right text-text-muted">
                        {gasto.percentual.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
