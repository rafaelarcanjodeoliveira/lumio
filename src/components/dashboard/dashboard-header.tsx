"use client";

import { useRouter } from "next/navigation";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DashboardHeaderProps = {
  nome: string;
  mes: number;
  ano: number;
};

export function DashboardHeader({ nome, mes, ano }: DashboardHeaderProps) {
  const router = useRouter();
  const referencia = new Date(ano, mes - 1, 1);
  const mesLabel = format(referencia, "MMM yyyy", { locale: ptBR });
  const mesCompleto = format(referencia, "MMMM yyyy", { locale: ptBR });

  function irParaMes(delta: number) {
    const novaData = addMonths(referencia, delta);
    router.push(
      `/dashboard?mes=${novaData.getMonth() + 1}&ano=${novaData.getFullYear()}`,
    );
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6 md:px-8">
      <div className="min-w-0">
        <p className="truncate text-[13px] text-text-muted">Olá, {nome} 👋</p>
        <p className="truncate text-[15px] font-medium capitalize text-text-primary">
          {mesCompleto}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-1 py-1">
        <button
          type="button"
          onClick={() => irParaMes(-1)}
          className="rounded-full p-1 text-text-muted hover:bg-neutral-soft"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="whitespace-nowrap text-[13px] font-medium capitalize text-text-primary">
          {mesLabel}
        </span>
        <button
          type="button"
          onClick={() => irParaMes(1)}
          className="rounded-full p-1 text-text-muted hover:bg-neutral-soft"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
