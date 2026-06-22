import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";

export type DiaCalendario = {
  data: Date;
  dataISO: string;
  noMes: boolean;
  entradas: number;
  saidas: number;
  temProvisionado: boolean;
  lancamentos: LancamentoComCategoria[];
};

/**
 * Monta a grade do calendário (semanas completas, domingo a sábado,
 * incluindo dias de preenchimento do mês anterior/seguinte). Os dias fora
 * do mês de referência ficam com `lancamentos: []` mesmo que existam
 * lançamentos reais para eles — o caller só busca dados do mês corrente.
 */
export function montarGradeCalendario(
  referencia: Date,
  lancamentos: LancamentoComCategoria[],
): DiaCalendario[][] {
  const inicioGrade = startOfWeek(startOfMonth(referencia), {
    weekStartsOn: 0,
  });
  const fimGrade = endOfWeek(endOfMonth(referencia), { weekStartsOn: 0 });
  const dias = eachDayOfInterval({ start: inicioGrade, end: fimGrade });

  const porData = new Map<string, LancamentoComCategoria[]>();
  for (const lancamento of lancamentos) {
    const lista = porData.get(lancamento.data) ?? [];
    lista.push(lancamento);
    porData.set(lancamento.data, lista);
  }

  const diasResumo: DiaCalendario[] = dias.map((data) => {
    const dataISO = format(data, "yyyy-MM-dd");
    const itens = porData.get(dataISO) ?? [];

    let entradas = 0;
    let saidas = 0;
    let temProvisionado = false;

    for (const item of itens) {
      if (item.tipo === "entrada") entradas += item.valor;
      else saidas += item.valor;
      if (item.status === "provisionado") temProvisionado = true;
    }

    return {
      data,
      dataISO,
      noMes: isSameMonth(data, referencia),
      entradas,
      saidas,
      temProvisionado,
      lancamentos: itens,
    };
  });

  const semanas: DiaCalendario[][] = [];
  for (let i = 0; i < diasResumo.length; i += 7) {
    semanas.push(diasResumo.slice(i, i + 7));
  }

  return semanas;
}
