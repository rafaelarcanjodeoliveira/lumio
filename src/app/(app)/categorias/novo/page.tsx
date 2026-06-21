import { Topbar } from "@/components/layout/topbar";
import { CategoriaForm } from "@/components/categorias/categoria-form";

export default function NovaCategoriaPage() {
  return (
    <>
      <Topbar
        title="Nova categoria"
        subtitle="Cadastre uma categoria de entrada ou saída"
      />
      <div className="flex-1 px-5 py-4">
        <CategoriaForm />
      </div>
    </>
  );
}
