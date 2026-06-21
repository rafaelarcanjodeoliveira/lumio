import { Topbar } from "@/components/layout/topbar";
import { ContaForm } from "@/components/contas/conta-form";

export default function NovaContaPage() {
  return (
    <>
      <Topbar
        title="Nova conta"
        subtitle="Cadastre uma conta, carteira ou cartão"
      />
      <div className="flex-1 px-5 py-4">
        <ContaForm />
      </div>
    </>
  );
}
