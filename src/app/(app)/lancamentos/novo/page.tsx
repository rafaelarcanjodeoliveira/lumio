import { Topbar } from "@/components/layout/topbar";
import { LancamentoForm } from "@/components/lancamentos/lancamento-form";
import { createClient } from "@/lib/supabase/server";

export default async function NovoLancamentoPage() {
  const supabase = await createClient();

  const [{ data: categorias }, { data: contas }] = await Promise.all([
    supabase
      .from("categorias")
      .select("id, nome, tipo")
      .eq("ativo", true)
      .order("nome"),
    supabase.from("contas").select("id, nome").eq("ativo", true).order("nome"),
  ]);

  return (
    <>
      <Topbar
        title="Novo lançamento"
        subtitle="Registre uma entrada ou saída"
      />
      <div className="flex-1 px-5 py-4">
        <LancamentoForm categorias={categorias ?? []} contas={contas ?? []} />
      </div>
    </>
  );
}
