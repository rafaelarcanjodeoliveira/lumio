"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { EvolucaoMensalPonto } from "@/lib/relatorios/calculations";

type EvolucaoMensalTabProps = {
  pontos: EvolucaoMensalPonto[];
};

export function EvolucaoMensalTab({ pontos }: EvolucaoMensalTabProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-[12px] font-medium text-text-primary">
        Entradas vs. saídas realizadas — últimos 6 meses
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={pontos}>
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
          <Line
            type="monotone"
            dataKey="entradasRealizadas"
            name="Entradas"
            stroke="var(--color-income)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="saidasRealizadas"
            name="Saídas"
            stroke="var(--color-expense)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
