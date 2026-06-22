import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { CategoriaForm } from "@/components/categorias/categoria-form";

export default function NovaCategoriaPage() {
  return (
    <>
      <Topbar
        title="Nova categoria"
        subtitle="Cadastre uma categoria de entrada ou saída"
      />
      <PageContainer>
        <CategoriaForm />
      </PageContainer>
    </>
  );
}
