"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  List,
  NotebookTabs,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Tag,
  Wallet,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BOTTOM_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/lancamentos", label: "Lançamentos", icon: List },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

const MORE_ITEMS = [
  { href: "/diario", label: "Diário", icon: NotebookTabs },
  { href: "/categorias", label: "Categorias", icon: Tag },
  { href: "/contas", label: "Contas", icon: Wallet },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const maisAtivo = MORE_ITEMS.some((item) => pathname === item.href);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-brand-text" : "text-text-faint"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
            maisAtivo ? "text-brand-text" : "text-text-faint"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          Mais
        </button>
      </nav>

      {menuAberto && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:hidden">
          <div className="w-full rounded-t-2xl bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">
                Mais opções
              </span>
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {MORE_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuAberto(false)}
                  className={`tap-target flex items-center gap-3 rounded-lg px-3 text-sm ${
                    pathname === href
                      ? "bg-brand-soft font-medium text-brand-text"
                      : "text-text-secondary hover:bg-neutral-soft"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="tap-target flex items-center gap-3 rounded-lg px-3 text-left text-sm text-text-secondary hover:bg-neutral-soft disabled:opacity-60"
              >
                <LogOut className="h-[18px] w-[18px]" />
                {isSigningOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
