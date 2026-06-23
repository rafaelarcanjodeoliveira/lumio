"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export function NovoLancamentoFab() {
  const pathname = usePathname();

  if (pathname.startsWith("/lancamentos/novo") || pathname.includes("/editar")) {
    return null;
  }

  return (
    <Link
      href="/lancamentos/novo"
      aria-label="Novo lançamento"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-dark shadow-card-hover transition-transform hover:bg-brand-hover active:scale-95 md:hidden"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
}
