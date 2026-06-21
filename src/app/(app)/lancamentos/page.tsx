import { endOfMonth, format, startOfMonth } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { LancamentosList } from "@/components/lancamentos/lancamentos-list";
import { createClient } from "@/lib/supabase/server";

type LancamentosPageProps = {
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function LancamentosPage({
  searchParams,
}: LancamentosPageProps) {
  const params = await searchParams;
  const hoje = new Date();
  const mes = Number(params.mes) || hoje.getMonth() + 1;
  const ano = Number(params.ano) || hoje.getFullYear();

  const referencia = new Date(ano, mes - 1, 1);
  const inicio = format(startOfMonth(referencia), "yyyy-MM-dd");
  const fim = format(endOfMonth(referencia), "yyyy-MM-dd");

  const supabase = await createClient();

  const [{ data: lancamentos }, { data: categorias }] = await Promise.all([
    supabase
      .from("lancamentos")
      .select("*, categorias(nome, cor), contas(nome)")
      .gte("data", inicio)
      .lte("data", fim)
      .order("data", { ascending: false }),
    supabase
      .from("categorias")
      .select("id, nome, tipo")
      .order("nome"),
  ]);

  return (
    <>
      <Topbar
        title="Lançamentos"
        subtitle="Liste, filtre, edite e exclua suas movimentações"
        actionHref="/lancamentos/novo"
        actionLabel="Novo lançamento"
      />
      <div className="flex-1 px-5 py-4">
        <LancamentosList
          key={`${mes}-${ano}`}
          initialLancamentos={lancamentos ?? []}
          categorias={categorias ?? []}
          mes={mes}
          ano={ano}
        />
      </div>
    </>
  );
}
