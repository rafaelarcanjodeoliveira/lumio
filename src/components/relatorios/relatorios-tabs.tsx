"use client";

import { useState } from "react";
import { GastosCategoriaTab } from "@/components/relatorios/gastos-categoria-tab";
import { EvolucaoMensalTab } from "@/components/relatorios/evolucao-mensal-tab";
import { RealizadoProvisionadoTab } from "@/components/relatorios/realizado-provisionado-tab";
import type { GastoPorCategoria } from "@/lib/dashboard/calculations";
import type {
  EvolucaoMensalPonto,
  RealizadoProvisionadoPonto,
} from "@/lib/relatorios/calculations";

const TABS = [
  { id: "categoria", label: "Gastos por categoria" },
  { id: "evolucao", label: "Evolução mensal" },
  { id: "realizado", label: "Realizado vs Provisionado" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type RelatoriosTabsProps = {
  mes: number;
  ano: number;
  gastosPorCategoria: GastoPorCategoria[];
  evolucaoMensal: EvolucaoMensalPonto[];
  realizadoVsProvisionado: RealizadoProvisionadoPonto[];
};

export function RelatoriosTabs({
  mes,
  ano,
  gastosPorCategoria,
  evolucaoMensal,
  realizadoVsProvisionado,
}: RelatoriosTabsProps) {
  const [tabAtiva, setTabAtiva] = useState<TabId>("categoria");

  return (
    <div>
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabAtiva(tab.id)}
            className={`shrink-0 whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors ${
              tabAtiva === tab.id
                ? "border-b-2 border-brand text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabAtiva === "categoria" && (
        <GastosCategoriaTab mes={mes} ano={ano} gastos={gastosPorCategoria} />
      )}
      {tabAtiva === "evolucao" && (
        <EvolucaoMensalTab pontos={evolucaoMensal} />
      )}
      {tabAtiva === "realizado" && (
        <RealizadoProvisionadoTab pontos={realizadoVsProvisionado} />
      )}
    </div>
  );
}
