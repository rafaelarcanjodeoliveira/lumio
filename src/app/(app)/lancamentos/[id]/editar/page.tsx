import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { LancamentoForm } from "@/components/lancamentos/lancamento-form";
import { createClient } from "@/lib/supabase/server";

type EditarLancamentoPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mes?: string; ano?: string }>;
};

export default async function EditarLancamentoPage({
  params,
  searchParams,
}: EditarLancamentoPageProps) {
  const { id } = await params;
  const { mes, ano } = await searchParams;
  const supabase = await createClient();

  const [{ data: lancamento }, { data: categorias }, { data: contas }] =
    await Promise.all([
      supabase.from("lancamentos").select("*").eq("id", id).single(),
      supabase
        .from("categorias")
        .select("id, nome, tipo")
        .eq("ativo", true)
        .order("nome"),
      supabase
        .from("contas")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome"),
    ]);

  if (!lancamento) {
    notFound();
  }

  return (
    <>
      <Topbar title="Editar lançamento" subtitle={lancamento.descricao} />
      <div className="flex-1 px-5 py-4">
        <LancamentoForm
          mode="editar"
          lancamentoId={lancamento.id}
          mes={mes ? Number(mes) : undefined}
          ano={ano ? Number(ano) : undefined}
          categorias={categorias ?? []}
          contas={contas ?? []}
          defaultValues={{
            tipo: lancamento.tipo,
            status: lancamento.status,
            data: lancamento.data,
            valor: lancamento.valor,
            descricao: lancamento.descricao,
            categoria_id: lancamento.categoria_id ?? "",
            conta_id: lancamento.conta_id ?? "",
            forma_pagamento: lancamento.forma_pagamento ?? undefined,
            observacao: lancamento.observacao ?? "",
          }}
        />
      </div>
    </>
  );
}
