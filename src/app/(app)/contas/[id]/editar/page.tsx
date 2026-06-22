import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { ContaForm } from "@/components/contas/conta-form";
import { createClient } from "@/lib/supabase/server";

type EditarContaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarContaPage({
  params,
}: EditarContaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: conta } = await supabase
    .from("contas")
    .select("*")
    .eq("id", id)
    .single();

  if (!conta) {
    notFound();
  }

  return (
    <>
      <Topbar title="Editar conta" subtitle={conta.nome} />
      <PageContainer>
        <ContaForm
          mode="editar"
          contaId={conta.id}
          defaultValues={{
            nome: conta.nome,
            tipo: conta.tipo,
            saldo_inicial: conta.saldo_inicial,
            ativo: conta.ativo,
          }}
        />
      </PageContainer>
    </>
  );
}
