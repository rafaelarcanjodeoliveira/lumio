"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { EvolucaoDiariaPonto } from "@/lib/dashboard/calculations";

type EvolucaoDiariaChartProps = {
  pontos: EvolucaoDiariaPonto[];
};

export function EvolucaoDiariaChart({ pontos }: EvolucaoDiariaChartProps) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[12px] font-medium text-text-primary">
          Evolução diária
        </h2>
        <span className="whitespace-nowrap text-[11px] text-text-muted">
          realizado · provisionado
        </span>
      </div>

      <div className="h-[180px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pontos} barCategoryGap={2}>
          <CartesianGrid vertical={false} stroke="var(--color-border-soft)" />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(valor: number) => formatCurrency(valor)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--color-border)",
              fontSize: 12,
            }}
            formatter={(valor) => formatCurrency(Number(valor))}
            labelFormatter={(dia) => `Dia ${dia}`}
          />
          <Bar
            dataKey="realizado"
            stackId="dia"
            fill="var(--color-income)"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="provisionado"
            stackId="dia"
            fill="var(--color-brand)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
