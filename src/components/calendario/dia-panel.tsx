"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DiaCalendario } from "@/lib/calendario/calculations";

type DiaPanelProps = {
  dia: DiaCalendario;
  onClose: () => void;
};

export function DiaPanel({ dia, onClose }: DiaPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-sm flex-col bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-text-primary capitalize">
              {format(dia.data, "d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p className="text-[11px] text-text-muted">
              {dia.lancamentos.length}{" "}
              {dia.lancamentos.length === 1 ? "lançamento" : "lançamentos"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {dia.lancamentos.length === 0 ? (
            <p className="text-sm text-text-muted">
              Nenhum lançamento neste dia.
            </p>
          ) : (
            <div className="flex flex-col">
              {dia.lancamentos.map((lancamento) => (
                <div
                  key={lancamento.id}
                  className="flex items-center justify-between border-b border-border-soft py-2.5 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          lancamento.categorias?.cor ?? "#888780",
                      }}
                    />
                    <div>
                      <p className="text-[13px] text-text-primary">
                        {lancamento.descricao}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {lancamento.categorias?.nome ?? "Sem categoria"} ·{" "}
                        {lancamento.status === "realizado"
                          ? "Realizado"
                          : "Provisionado"}
                      </p>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
