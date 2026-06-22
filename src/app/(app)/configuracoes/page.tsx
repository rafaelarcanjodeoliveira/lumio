import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { PageContainer } from "@/components/ui/page-container";
import { PerfilForm } from "@/components/configuracoes/perfil-form";
import { createClient } from "@/lib/supabase/server";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();

  return (
    <>
      <Topbar title="Configurações" subtitle="Preferências da conta" />
      <PageContainer>
        <PerfilForm
          userId={user.id}
          nome={profile?.nome ?? ""}
          email={user.email ?? ""}
        />
      </PageContainer>
    </>
  );
}
