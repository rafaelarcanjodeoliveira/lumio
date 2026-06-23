import { endOfMonth, format, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageContainer } from "@/components/ui/page-container";
import { HeroCard } from "@/components/dashboard/hero-card";
import { MiniCards } from "@/components/dashboard/mini-cards";
import { GastosPorCategoria } from "@/components/dashboard/gastos-por-categoria";
import { ProximosVencimentos } from "@/components/dashboard/proximos-vencimentos";
import { UltimosLancamentos } from "@/components/dashboard/ultimos-lancamentos";
import {
  calcularResumoMensal,
  calcularGastosPorCategoria,
  calcularProximosVencimentos,
  selecionarUltimosLancamentos,
  type LancamentoComCategoria,
} from "@/lib/dashboard/calculations";
import { createClient } from "@/lib/supabase/server";

type DashboardPageProps = {
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const hoje = new Date();
  const mes = Number(params.mes) || hoje.getMonth() + 1;
  const ano = Number(params.ano) || hoje.getFullYear();
  const hojeISO = format(hoje, "yyyy-MM-dd");

  const referencia = new Date(ano, mes - 1, 1);
  const inicio = format(startOfMonth(referencia), "yyyy-MM-dd");
  const fim = format(endOfMonth(referencia), "yyyy-MM-dd");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: lancamentos }] = await Promise.all([
    supabase.from("profiles").select("nome").eq("id", user.id).single(),
    supabase
      .from("lancamentos")
      .select(
        "id, tipo, status, descricao, valor, data, categoria_id, categorias(nome, cor)",
      )
      .gte("data", inicio)
      .lte("data", fim)
      .order("data", { ascending: false })
      .returns<LancamentoComCategoria[]>(),
  ]);

  const registros = lancamentos ?? [];

  const resumo = calcularResumoMensal(registros, hojeISO);
  const gastosPorCategoria = calcularGastosPorCategoria(registros);
  const proximosVencimentos = calcularProximosVencimentos(registros, hoje);
  const ultimosLancamentos = selecionarUltimosLancamentos(registros, 3);

  const primeiroNome = (profile?.nome ?? "").trim().split(" ")[0] || "você";

  return (
    <>
      <DashboardHeader nome={primeiroNome} mes={mes} ano={ano} />
      <PageContainer key={`${mes}-${ano}`} className="space-y-4">
        <HeroCard
          saldoAtual={resumo.saldoAtual}
          entradasRealizadas={resumo.entradasRealizadas}
          saidasRealizadas={resumo.saidasRealizadas}
          saldoPrevisto={resumo.saldoPrevisto}
        />

        <MiniCards
          provisionadoLiquido={resumo.provisionadoLiquido}
          disponivelHoje={resumo.disponivelHoje}
        />

        <ProximosVencimentos vencimentos={proximosVencimentos} />

        <GastosPorCategoria gastos={gastosPorCategoria} />

        <UltimosLancamentos lancamentos={ultimosLancamentos} />
      </PageContainer>
    </>
  );
}
