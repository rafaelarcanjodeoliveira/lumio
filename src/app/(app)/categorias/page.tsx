import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { CategoriasList } from "@/components/categorias/categorias-list";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriasPage() {
  const supabase = await createClient();

  const [{ data: categorias }, { data: vinculos }] = await Promise.all([
    supabase.from("categorias").select("*").order("nome"),
    supabase.from("lancamentos").select("categoria_id"),
  ]);

  const idsComLancamento = new Set(
    (vinculos ?? [])
      .map((item) => item.categoria_id)
      .filter((id): id is string => Boolean(id)),
  );

  const categoriasComVinculo = (categorias ?? []).map((categoria) => ({
    ...categoria,
    temLancamentos: idsComLancamento.has(categoria.id),
  }));

  return (
    <>
      <Topbar
        title="Categorias"
        subtitle="Organize entradas e saídas por categoria"
        actionHref="/categorias/novo"
        actionLabel="Nova categoria"
      />
      <PageContainer>
        <CategoriasList initialCategorias={categoriasComVinculo} />
      </PageContainer>
    </>
  );
}
