"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { RealizadoProvisionadoPonto } from "@/lib/relatorios/calculations";

type RealizadoProvisionadoTabProps = {
  pontos: RealizadoProvisionadoPonto[];
};

export function RealizadoProvisionadoTab({
  pontos,
}: RealizadoProvisionadoTabProps) {
  return (
    <Card>
      <h2 className="mb-3 text-[12px] font-medium text-text-primary">
        Realizado vs. provisionado — últimos 6 meses
      </h2>

      <div className="h-[220px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pontos}>
          <CartesianGrid vertical={false} stroke="var(--color-border-soft)" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
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
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="realizado"
            name="Realizado"
            stackId="mes"
            fill="var(--color-income)"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="provisionado"
            name="Provisionado"
            stackId="mes"
            fill="var(--color-chart-provisionado)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
