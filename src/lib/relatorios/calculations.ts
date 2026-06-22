import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export type LancamentoMensal = {
  tipo: "entrada" | "saida";
  status: "realizado" | "provisionado";
  valor: number;
  data: string;
};

function chaveMes(dataISO: string): string {
  return dataISO.slice(0, 7);
}

export function formatarLabelMes(chave: string): string {
  const [ano, mes] = chave.split("-").map(Number);
  return format(new Date(ano, mes - 1, 1), "MMM/yy", { locale: ptBR });
}

/** Chaves "yyyy-MM" das últimas `quantidade` meses, da mais antiga à mais recente. */
export function gerarChavesUltimosMeses(
  quantidade: number,
  referencia: Date,
): string[] {
  const chaves: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    chaves.push(format(subMonths(startOfMonth(referencia), i), "yyyy-MM"));
  }
  return chaves;
}

export type EvolucaoMensalPonto = {
  mes: string;
  entradasRealizadas: number;
  saidasRealizadas: number;
};

export function calcularEvolucaoMensal(
  lancamentos: LancamentoMensal[],
  chavesMeses: string[],
): EvolucaoMensalPonto[] {
  const totais = new Map<
    string,
    { entradasRealizadas: number; saidasRealizadas: number }
  >();
  for (const chave of chavesMeses) {
    totais.set(chave, { entradasRealizadas: 0, saidasRealizadas: 0 });
  }

  for (const lancamento of lancamentos) {
    if (lancamento.status !== "realizado") continue;
    const bucket = totais.get(chaveMes(lancamento.data));
    if (!bucket) continue;

    if (lancamento.tipo === "entrada") {
      bucket.entradasRealizadas += lancamento.valor;
    } else {
      bucket.saidasRealizadas += lancamento.valor;
    }
  }

  return chavesMeses.map((chave) => ({
    mes: formatarLabelMes(chave),
    ...totais.get(chave)!,
  }));
}

export type RealizadoProvisionadoPonto = {
  mes: string;
  realizado: number;
  provisionado: number;
};

export function calcularRealizadoVsProvisionado(
  lancamentos: LancamentoMensal[],
  chavesMeses: string[],
): RealizadoProvisionadoPonto[] {
  const totais = new Map<string, { realizado: number; provisionado: number }>();
  for (const chave of chavesMeses) {
    totais.set(chave, { realizado: 0, provisionado: 0 });
  }

  for (const lancamento of lancamentos) {
    const bucket = totais.get(chaveMes(lancamento.data));
    if (!bucket) continue;

    if (lancamento.status === "realizado") {
      bucket.realizado += lancamento.valor;
    } else {
      bucket.provisionado += lancamento.valor;
    }
  }

  return chavesMeses.map((chave) => ({
    mes: formatarLabelMes(chave),
    ...totais.get(chave)!,
  }));
}
