import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";

export type DiaDiario = {
  data: Date;
  dataISO: string;
  entradas: number;
  saidas: number;
  diario: number;
  saldoAcumulado: number;
  temProvisionado: boolean;
  ehHoje: boolean;
  lancamentos: LancamentoComCategoria[];
};

export type ResumoDiario = {
  totalEntradas: number;
  totalSaidas: number;
  totalDiario: number;
  saldoFinal: number;
  performance: number;
};

/**
 * Visão de fluxo diário, estilo planilha. Realizados e provisionados entram
 * juntos na soma do dia (pedido do usuário). "Diário" = entradas - saídas do
 * dia; "saldoAcumulado" começa em zero no dia 1 e soma o "diário" de cada
 * dia até o dia atual — não herda saldo de meses anteriores.
 */
export function montarDiasDoMes(
  referencia: Date,
  lancamentos: LancamentoComCategoria[],
  hojeISO: string,
): { dias: DiaDiario[]; resumo: ResumoDiario } {
  const dias = eachDayOfInterval({
    start: startOfMonth(referencia),
    end: endOfMonth(referencia),
  });

  const porDia = new Map<string, LancamentoComCategoria[]>();
  for (const lancamento of lancamentos) {
    const lista = porDia.get(lancamento.data) ?? [];
    lista.push(lancamento);
    porDia.set(lancamento.data, lista);
  }

  let saldoAcumulado = 0;
  let totalEntradas = 0;
  let totalSaidas = 0;

  const diasDiario: DiaDiario[] = dias.map((data) => {
    const dataISO = format(data, "yyyy-MM-dd");
    const itens = porDia.get(dataISO) ?? [];

    let entradas = 0;
    let saidas = 0;
    let temProvisionado = false;

    for (const item of itens) {
      if (item.tipo === "entrada") entradas += item.valor;
      else saidas += item.valor;
      if (item.status === "provisionado") temProvisionado = true;
    }

    const diario = entradas - saidas;
    saldoAcumulado += diario;
    totalEntradas += entradas;
    totalSaidas += saidas;

    return {
      data,
      dataISO,
      entradas,
      saidas,
      diario,
      saldoAcumulado,
      temProvisionado,
      ehHoje: dataISO === hojeISO,
      lancamentos: itens,
    };
  });

  return {
    dias: diasDiario,
    resumo: {
      totalEntradas,
      totalSaidas,
      totalDiario: totalEntradas - totalSaidas,
      saldoFinal: saldoAcumulado,
      performance: totalEntradas - totalSaidas,
    },
  };
}
