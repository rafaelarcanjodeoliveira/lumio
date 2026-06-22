import { endOfMonth, format, startOfMonth } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { CalendarioGrid } from "@/components/calendario/calendario-grid";
import type { LancamentoComCategoria } from "@/lib/dashboard/calculations";
import { createClient } from "@/lib/supabase/server";

type CalendarioPageProps = {
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function CalendarioPage({
  searchParams,
}: CalendarioPageProps) {
  const params = await searchParams;
  const hoje = new Date();
  const mes = Number(params.mes) || hoje.getMonth() + 1;
  const ano = Number(params.ano) || hoje.getFullYear();

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

  return (
    <>
      <Topbar
        title="Calendário"
        subtitle="Entradas, saídas e vencimentos dia a dia"
      />
      <div className="flex-1 px-5 py-4">
        <CalendarioGrid
          key={`${mes}-${ano}`}
          mes={mes}
          ano={ano}
          lancamentos={lancamentos ?? []}
        />
      </div>
    </>
  );
}
