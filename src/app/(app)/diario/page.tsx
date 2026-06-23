import { endOfMonth, format, startOfMonth } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { DiarioTable } from "@/components/diario/diario-table";
import { montarDiasDoMes } from "@/lib/diario/calculations";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";
import { createClient } from "@/lib/supabase/server";

type DiarioPageProps = {
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function DiarioPage({ searchParams }: DiarioPageProps) {
  const params = await searchParams;
  const hoje = new Date();
  const mes = Number(params.mes) || hoje.getMonth() + 1;
  const ano = Number(params.ano) || hoje.getFullYear();
  const hojeISO = format(hoje, "yyyy-MM-dd");

  const referencia = new Date(ano, mes - 1, 1);
  const inicio = format(startOfMonth(referencia), "yyyy-MM-dd");
  const fim = format(endOfMonth(referencia), "yyyy-MM-dd");

  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select(
      "id, tipo, status, descricao, valor, data, categoria_id, categorias(nome, cor)",
    )
    .gte("data", inicio)
    .lte("data", fim)
    .order("data", { ascending: true })
    .returns<LancamentoComCategoria[]>();

  const { dias, resumo } = montarDiasDoMes(
    referencia,
    lancamentos ?? [],
    hojeISO,
  );

  return (
    <>
      <Topbar
        title="Diário"
        subtitle="Fluxo diário do mês, estilo planilha"
      />
      <PageContainer>
        <DiarioTable
          key={`${mes}-${ano}`}
          mes={mes}
          ano={ano}
          dias={dias}
          resumo={resumo}
        />
      </PageContainer>
    </>
  );
}
