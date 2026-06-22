import { endOfMonth, format, startOfMonth } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { ResumoCards } from "@/components/dashboard/resumo-cards";
import { EvolucaoDiariaChart } from "@/components/dashboard/evolucao-diaria-chart";
import { GastosPorCategoria } from "@/components/dashboard/gastos-por-categoria";
import { ProximosVencimentos } from "@/components/dashboard/proximos-vencimentos";
import { UltimosLancamentos } from "@/components/dashboard/ultimos-lancamentos";
import {
  calcularResumoMensal,
  calcularEvolucaoDiaria,
  calcularGastosPorCategoria,
  calcularProximosVencimentos,
  selecionarUltimosLancamentos,
  type LancamentoComCategoria,
} from "@/lib/dashboard/calculations";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const hoje = new Date();
  const inicio = format(startOfMonth(hoje), "yyyy-MM-dd");
  const fim = format(endOfMonth(hoje), "yyyy-MM-dd");
  const hojeISO = format(hoje, "yyyy-MM-dd");

  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select(
      "id, tipo, status, descricao, valor, data, categoria_id, categorias(nome, cor)",
    )
    .gte("data", inicio)
    .lte("data", fim)
    .order("data", { ascending: false })
    .returns<LancamentoComCategoria[]>();

  const registros = lancamentos ?? [];

  const resumo = calcularResumoMensal(registros, hojeISO);
  const evolucaoDiaria = calcularEvolucaoDiaria(registros, hoje);
  const gastosPorCategoria = calcularGastosPorCategoria(registros);
  const proximosVencimentos = calcularProximosVencimentos(registros, hoje);
  const ultimosLancamentos = selecionarUltimosLancamentos(registros);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Clareza para seu mês financeiro"
        actionHref="/lancamentos/novo"
        actionLabel="Novo lançamento"
      />
      <PageContainer className="space-y-5 sm:space-y-6">
        <ResumoCards resumo={resumo} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <EvolucaoDiariaChart pontos={evolucaoDiaria} />
          <UltimosLancamentos lancamentos={ultimosLancamentos} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GastosPorCategoria gastos={gastosPorCategoria} />
          <ProximosVencimentos vencimentos={proximosVencimentos} />
        </div>
      </PageContainer>
    </>
  );
}
