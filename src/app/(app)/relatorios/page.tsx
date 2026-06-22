import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { RelatoriosTabs } from "@/components/relatorios/relatorios-tabs";
import {
  calcularGastosPorCategoria,
  type LancamentoComCategoria,
} from "@/lib/dashboard/calculations";
import {
  calcularEvolucaoMensal,
  calcularRealizadoVsProvisionado,
  gerarChavesUltimosMeses,
  type LancamentoMensal,
} from "@/lib/relatorios/calculations";
import { createClient } from "@/lib/supabase/server";

type RelatoriosPageProps = {
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function RelatoriosPage({
  searchParams,
}: RelatoriosPageProps) {
  const params = await searchParams;
  const hoje = new Date();
  const mes = Number(params.mes) || hoje.getMonth() + 1;
  const ano = Number(params.ano) || hoje.getFullYear();
  const referenciaMes = new Date(ano, mes - 1, 1);

  const inicioMes = format(startOfMonth(referenciaMes), "yyyy-MM-dd");
  const fimMes = format(endOfMonth(referenciaMes), "yyyy-MM-dd");

  const inicioJanela = format(startOfMonth(subMonths(hoje, 5)), "yyyy-MM-dd");
  const fimJanela = format(endOfMonth(hoje), "yyyy-MM-dd");

  const supabase = await createClient();

  const [{ data: lancamentosMes }, { data: lancamentosJanela }] =
    await Promise.all([
      supabase
        .from("lancamentos")
        .select(
          "id, tipo, status, descricao, valor, data, categoria_id, categorias(nome, cor)",
        )
        .gte("data", inicioMes)
        .lte("data", fimMes)
        .returns<LancamentoComCategoria[]>(),
      supabase
        .from("lancamentos")
        .select("tipo, status, valor, data")
        .gte("data", inicioJanela)
        .lte("data", fimJanela)
        .returns<LancamentoMensal[]>(),
    ]);

  const chavesMeses = gerarChavesUltimosMeses(6, hoje);
  const gastosPorCategoria = calcularGastosPorCategoria(lancamentosMes ?? []);
  const evolucaoMensal = calcularEvolucaoMensal(
    lancamentosJanela ?? [],
    chavesMeses,
  );
  const realizadoVsProvisionado = calcularRealizadoVsProvisionado(
    lancamentosJanela ?? [],
    chavesMeses,
  );

  return (
    <>
      <Topbar
        title="Relatórios"
        subtitle="Análises e comparativos financeiros"
      />
      <div className="flex-1 px-5 py-4">
        <RelatoriosTabs
          mes={mes}
          ano={ano}
          gastosPorCategoria={gastosPorCategoria}
          evolucaoMensal={evolucaoMensal}
          realizadoVsProvisionado={realizadoVsProvisionado}
        />
      </div>
    </>
  );
}
