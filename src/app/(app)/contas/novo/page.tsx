import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { ContaForm } from "@/components/contas/conta-form";

export default function NovaContaPage() {
  return (
    <>
      <Topbar
        title="Nova conta"
        subtitle="Cadastre uma conta, carteira ou cartão"
      />
      <PageContainer>
        <ContaForm />
      </PageContainer>
    </>
  );
}
