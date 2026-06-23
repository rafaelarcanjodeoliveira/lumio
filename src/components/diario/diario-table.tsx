"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DiaDiario, ResumoDiario } from "@/lib/diario/calculations";
import { DiaPanel } from "@/components/calendario/dia-panel";

type DiarioTableProps = {
  mes: number;
  ano: number;
  dias: DiaDiario[];
  resumo: ResumoDiario;
};

function celula(valor: number, ativo: boolean) {
  return ativo ? formatCurrency(valor) : "—";
}

export function DiarioTable({ mes, ano, dias, resumo }: DiarioTableProps) {
  const router = useRouter();
  const referencia = new Date(ano, mes - 1, 1);
  const mesLabel = format(referencia, "MMMM yyyy", { locale: ptBR });

  const [diaSelecionado, setDiaSelecionado] = useState<DiaDiario | null>(
    null,
  );

  function irParaMes(delta: number) {
    const novaData = addMonths(referencia, delta);
    router.push(
      `/diario?mes=${novaData.getMonth() + 1}&ano=${novaData.getFullYear()}`,
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

      <div className="rounded-xl border border-border bg-surface shadow-card">
        <div className="max-h-[60vh] overflow-auto rounded-t-xl">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="text-left text-[11px] text-text-muted">
                <th className="sticky top-0 bg-surface py-2.5 pl-4 font-medium">
                  Data
                </th>
                <th className="sticky top-0 bg-surface py-2.5 text-right font-medium">
                  Entrada
                </th>
                <th className="sticky top-0 bg-surface py-2.5 text-right font-medium">
                  Saída
                </th>
                <th className="sticky top-0 bg-surface py-2.5 text-right font-medium">
                  Diário
                </th>
                <th className="sticky top-0 bg-surface py-2.5 pr-4 text-right font-medium">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody>
              {dias.map((dia) => {
                const temAtividade = dia.entradas > 0 || dia.saidas > 0;
                const opacidade = dia.temProvisionado
                  ? "opacity-70"
                  : undefined;

                return (
                  <tr
                    key={dia.dataISO}
                    onClick={() => setDiaSelecionado(dia)}
                    className={`cursor-pointer border-b border-border-soft transition-colors hover:bg-neutral-soft ${
                      dia.ehHoje ? "bg-brand-soft" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap py-2 pl-4 text-text-secondary">
                      {format(dia.data, "dd/MM")}
                    </td>
                    <td
                      className={`whitespace-nowrap py-2 text-right ${
                        dia.entradas > 0 ? "text-income" : "text-text-muted"
                      } ${opacidade ?? ""}`}
                    >
                      {celula(dia.entradas, dia.entradas > 0)}
                    </td>
                    <td
                      className={`whitespace-nowrap py-2 text-right ${
                        dia.saidas > 0 ? "text-expense" : "text-text-muted"
                      } ${opacidade ?? ""}`}
                    >
                      {celula(dia.saidas, dia.saidas > 0)}
                    </td>
                    <td
                      className={`whitespace-nowrap py-2 text-right font-medium ${
                        !temAtividade
                          ? "text-text-muted"
                          : dia.diario < 0
                            ? "text-expense"
                            : "text-text-primary"
                      } ${opacidade ?? ""}`}
                    >
                      {temAtividade ? formatCurrency(dia.diario) : "—"}
                    </td>
                    <td
                      className={`whitespace-nowrap py-2 pr-4 text-right font-semibold tracking-tight ${
                        dia.saldoAcumulado < 0 ? "text-expense" : "text-balance"
                      }`}
                    >
                      {formatCurrency(dia.saldoAcumulado)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border px-4 py-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-text-muted">Total entradas</p>
            <p className="text-[14px] font-semibold tracking-tight text-income">
              {formatCurrency(resumo.totalEntradas)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted">Total saídas</p>
            <p className="text-[14px] font-semibold tracking-tight text-expense">
              {formatCurrency(resumo.totalSaidas)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted">Total diário</p>
            <p
              className={`text-[14px] font-semibold tracking-tight ${
                resumo.totalDiario < 0 ? "text-expense" : "text-text-primary"
              }`}
            >
              {formatCurrency(resumo.totalDiario)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted">Saldo final</p>
            <p
              className={`text-[14px] font-semibold tracking-tight ${
                resumo.saldoFinal < 0 ? "text-expense" : "text-balance"
              }`}
            >
              {formatCurrency(resumo.saldoFinal)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-b-xl border-t border-border-soft bg-neutral-soft/40 px-4 py-3">
          <span className="text-[12px] font-medium text-text-secondary">
            Performance
          </span>
          <span
            className={`text-[15px] font-bold tracking-tight ${
              resumo.performance >= 0 ? "text-income" : "text-expense"
            }`}
          >
            {formatCurrency(resumo.performance)}
          </span>
        </div>
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
