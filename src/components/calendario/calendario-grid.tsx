"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import {
  montarGradeCalendario,
  type DiaCalendario,
} from "@/lib/calendario/calculations";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";
import { DiaPanel } from "@/components/calendario/dia-panel";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type CalendarioGridProps = {
  mes: number;
  ano: number;
  lancamentos: LancamentoComCategoria[];
};

export function CalendarioGrid({ mes, ano, lancamentos }: CalendarioGridProps) {
  const router = useRouter();
  const referencia = new Date(ano, mes - 1, 1);
  const semanas = montarGradeCalendario(referencia, lancamentos);
  const mesLabel = format(referencia, "MMMM yyyy", { locale: ptBR });

  const [diaSelecionado, setDiaSelecionado] = useState<DiaCalendario | null>(
    null,
  );

  function irParaMes(delta: number) {
    const novaData = addMonths(referencia, delta);
    router.push(
      `/calendario?mes=${novaData.getMonth() + 1}&ano=${novaData.getFullYear()}`,
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

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-7 border-b border-border-soft">
          {DIAS_SEMANA.map((dia) => (
            <div
              key={dia}
              className="px-2 py-2 text-center text-[11px] font-medium text-text-muted"
            >
              {dia}
            </div>
          ))}
        </div>

        {semanas.map((semana, semanaIndex) => {
          const isUltimaSemana = semanaIndex === semanas.length - 1;

          return (
            <div key={semanaIndex} className="grid grid-cols-7">
              {semana.map((dia, diaIndex) => {
                const isUltimaColuna = diaIndex === 6;

                return (
                  <button
                    key={dia.dataISO}
                    type="button"
                    disabled={!dia.noMes}
                    onClick={() => setDiaSelecionado(dia)}
                    className={`flex min-h-[78px] flex-col items-start gap-1 p-1.5 text-left ${
                      isUltimaColuna ? "" : "border-r border-border-soft"
                    } ${isUltimaSemana ? "" : "border-b border-border-soft"} ${
                      dia.noMes ? "hover:bg-neutral-soft" : "bg-background"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`text-[11px] ${
                          dia.noMes ? "text-text-secondary" : "text-text-muted"
                        }`}
                      >
                        {dia.data.getDate()}
                      </span>
                      {dia.temProvisionado && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-brand"
                          title="Há lançamentos provisionados"
                        />
                      )}
                    </div>
                    {dia.entradas > 0 && (
                      <span className="text-[10px] font-medium text-income">
                        + {formatCurrency(dia.entradas)}
                      </span>
                    )}
                    {dia.saidas > 0 && (
                      <span className="text-[10px] font-medium text-expense">
                        − {formatCurrency(dia.saidas)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {diaSelecionado && (
        <DiaPanel
          dia={diaSelecionado}
          onClose={() => setDiaSelecionado(null)}
        />
      )}
    </div>
  );
}
