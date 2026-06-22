import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NovoLancamentoFab } from "@/components/layout/novo-lancamento-fab";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-background">
        {children}
      </div>
      <MobileNavigation />
      <NovoLancamentoFab />
    </div>
  );
}
