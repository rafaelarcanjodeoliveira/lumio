import { differenceInCalendarDays, parseISO } from "date-fns";

export type LancamentoComCategoria = {
  id: string;
  tipo: "entrada" | "saida";
  status: "realizado" | "provisionado";
  descricao: string;
  valor: number;
  data: string;
  categoria_id: string | null;
  categorias: { nome: string; cor: string } | null;
};

export type ResumoMensal = {
  entradasRealizadas: number;
  saidasRealizadas: number;
  entradasProvisionadas: number;
  saidasProvisionadas: number;
  provisionadoLiquido: number;
  saldoAtual: number;
  saldoPrevisto: number;
  disponivelHoje: number;
};

/**
 * Fórmulas de saldoAtual/saldoPrevisto vêm de docs/CLAUDE.md §6.1/6.2.
 * provisionadoLiquido e disponivelHoje não têm fórmula formal no spec —
 * são derivadas do mockup original (card "Provisionado" = líquido a
 * realizar; "Disponível hoje" = saldo atual já descontando provisionados
 * cuja data já chegou).
 */
export function calcularResumoMensal(
  lancamentos: LancamentoComCategoria[],
  hojeISO: string,
): ResumoMensal {
  let entradasRealizadas = 0;
  let saidasRealizadas = 0;
  let entradasProvisionadas = 0;
  let saidasProvisionadas = 0;
  let entradasProvisionadasVencidas = 0;
  let saidasProvisionadasVencidas = 0;

  for (const lancamento of lancamentos) {
    const { valor, tipo, status, data } = lancamento;

    if (status === "realizado") {
      if (tipo === "entrada") entradasRealizadas += valor;
      else saidasRealizadas += valor;
      continue;
    }

    if (tipo === "entrada") {
      entradasProvisionadas += valor;
      if (data <= hojeISO) entradasProvisionadasVencidas += valor;
    } else {
      saidasProvisionadas += valor;
      if (data <= hojeISO) saidasProvisionadasVencidas += valor;
    }
  }

  const provisionadoLiquido = entradasProvisionadas - saidasProvisionadas;
  const saldoAtual = entradasRealizadas - saidasRealizadas;
  const saldoPrevisto = saldoAtual + provisionadoLiquido;
  const disponivelHoje =
    saldoAtual - saidasProvisionadasVencidas + entradasProvisionadasVencidas;

  return {
    entradasRealizadas,
    saidasRealizadas,
    entradasProvisionadas,
    saidasProvisionadas,
    provisionadoLiquido,
    saldoAtual,
    saldoPrevisto,
    disponivelHoje,
  };
}

export type GastoPorCategoria = {
  categoriaId: string;
  nome: string;
  cor: string;
  valor: number;
  percentual: number;
};

export function calcularGastosPorCategoria(
  lancamentos: LancamentoComCategoria[],
): GastoPorCategoria[] {
  const totais = new Map<string, { nome: string; cor: string; valor: number }>();
  let totalGeral = 0;

  for (const lancamento of lancamentos) {
    if (lancamento.tipo !== "saida") continue;

    totalGeral += lancamento.valor;
    const chave = lancamento.categoria_id ?? "sem-categoria";
    const atual = totais.get(chave);

    if (atual) {
      atual.valor += lancamento.valor;
    } else {
      totais.set(chave, {
        nome: lancamento.categorias?.nome ?? "Sem categoria",
        cor: lancamento.categorias?.cor ?? "#888780",
        valor: lancamento.valor,
      });
    }
  }

  return Array.from(totais.entries())
    .map(([categoriaId, dados]) => ({
      categoriaId,
      nome: dados.nome,
      cor: dados.cor,
      valor: dados.valor,
      percentual: totalGeral > 0 ? (dados.valor / totalGeral) * 100 : 0,
    }))
    .sort((a, b) => b.valor - a.valor);
}

export type ProximoVencimento = LancamentoComCategoria & {
  diasRestantes: number;
  urgente: boolean;
};

/** Só saídas provisionadas — vencimentos de entradas não entram aqui. */
export function calcularProximosVencimentos(
  lancamentos: LancamentoComCategoria[],
  hoje: Date,
): ProximoVencimento[] {
  return lancamentos
    .filter(
      (lancamento) =>
        lancamento.status === "provisionado" && lancamento.tipo === "saida",
    )
    .map((lancamento) => {
      const diasRestantes = differenceInCalendarDays(
        parseISO(lancamento.data),
        hoje,
      );
      return { ...lancamento, diasRestantes, urgente: diasRestantes <= 0 };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}

export function selecionarUltimosLancamentos(
  lancamentos: LancamentoComCategoria[],
  quantidade = 5,
): LancamentoComCategoria[] {
  return [...lancamentos]
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0))
    .slice(0, quantidade);
}
