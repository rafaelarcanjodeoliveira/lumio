import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { ContasList } from "@/components/contas/contas-list";
import { createClient } from "@/lib/supabase/server";

export default async function ContasPage() {
  const supabase = await createClient();

  const [{ data: contas }, { data: vinculos }] = await Promise.all([
    supabase.from("contas").select("*").order("nome"),
    supabase.from("lancamentos").select("conta_id"),
  ]);

  const idsComLancamento = new Set(
    (vinculos ?? [])
      .map((item) => item.conta_id)
      .filter((id): id is string => Boolean(id)),
  );

  const contasComVinculo = (contas ?? []).map((conta) => ({
    ...conta,
    temLancamentos: idsComLancamento.has(conta.id),
  }));

  return (
    <>
      <Topbar
        title="Contas"
        subtitle="Gerencie contas, carteiras e cartões"
        actionHref="/contas/novo"
        actionLabel="Nova conta"
      />
      <PageContainer>
        <ContasList initialContas={contasComVinculo} />
      </PageContainer>
    </>
  );
}
