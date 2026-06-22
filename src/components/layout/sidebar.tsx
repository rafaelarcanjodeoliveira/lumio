"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Calendar,
  Tag,
  Wallet,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lancamentos", label: "Lançamentos", icon: List },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/categorias", label: "Categorias", icon: Tag },
  { href: "/contas", label: "Contas", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-[200px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-[18px]">
        <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand">
          <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
            <rect x="3" y="1.5" width="3" height="10" rx="1" fill="#412402" />
            <rect x="3" y="9" width="8" height="3" rx="1" fill="#412402" />
            <line x1="7" y1="0" x2="7" y2="1.5" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="11" y1="1" x2="10" y2="2.2" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="12.5" y1="4.5" x2="11" y2="4.5" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[15px] font-medium tracking-wide text-brand-dark">
          Lumio
        </span>
      </div>

      <nav className="flex-1 px-2 py-2.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`mb-px flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors ${
                active
                  ? "bg-brand-soft font-medium text-brand-text"
                  : "text-text-faint hover:bg-neutral-soft"
              }`}
            >
              <Icon className="h-[15px] w-[15px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3.5 py-3">
        <div className="mb-1 text-[11px] text-text-muted">Período ativo</div>
        <div className="flex items-center justify-between text-[13px] font-medium text-text-primary">
          Junho 2026
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </div>
      </div>

      <div className="border-t border-border px-2 py-2">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] text-text-faint transition-colors hover:bg-neutral-soft disabled:opacity-60"
        >
          <LogOut className="h-[15px] w-[15px]" />
          {isSigningOut ? "Saindo..." : "Sair"}
        </button>
      </div>
    </aside>
  );
}
