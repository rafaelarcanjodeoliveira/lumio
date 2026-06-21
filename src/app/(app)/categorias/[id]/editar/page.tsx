import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { CategoriaForm } from "@/components/categorias/categoria-form";
import { createClient } from "@/lib/supabase/server";

type EditarCategoriaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarCategoriaPage({
  params,
}: EditarCategoriaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categoria } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();

  if (!categoria) {
    notFound();
  }

  return (
    <>
      <Topbar title="Editar categoria" subtitle={categoria.nome} />
      <div className="flex-1 px-5 py-4">
        <CategoriaForm
          mode="editar"
          categoriaId={categoria.id}
          defaultValues={{
            nome: categoria.nome,
            tipo: categoria.tipo,
            cor: categoria.cor,
            ativo: categoria.ativo,
          }}
        />
      </div>
    </>
  );
}
