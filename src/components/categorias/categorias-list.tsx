"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Tag, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";

type CategoriaRow = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida" | "ambos";
  cor: string;
  ativo: boolean;
  temLancamentos: boolean;
};

type CategoriasListProps = {
  initialCategorias: CategoriaRow[];
};

const TIPO_LABELS: Record<CategoriaRow["tipo"], string> = {
  entrada: "Entrada",
  saida: "Saída",
  ambos: "Ambos",
};

export function CategoriasList({ initialCategorias }: CategoriasListProps) {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoriaParaExcluir, setCategoriaParaExcluir] =
    useState<CategoriaRow | null>(null);

  async function excluirCategoria(categoria: CategoriaRow) {
    setActionError(null);
    setCategoriaParaExcluir(null);

    const supabase = createClient();

    const { count } = await supabase
      .from("lancamentos")
      .select("id", { count: "exact", head: true })
      .eq("categoria_id", categoria.id);

    if (count && count > 0) {
      setActionError(
        "Não é possível excluir: existem lançamentos vinculados a esta categoria.",
      );
      setCategorias((prev) =>
        prev.map((item) =>
          item.id === categoria.id ? { ...item, temLancamentos: true } : item,
        ),
      );
      return;
    }

    const snapshot = categorias;
    setCategorias((prev) => prev.filter((item) => item.id !== categoria.id));

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", categoria.id);

    if (error) {
      setActionError("Não foi possível excluir a categoria.");
      setCategorias(snapshot);
    }
  }

  return (
    <div>
      {actionError && (
        <p className="mb-3 text-[12px] text-expense">{actionError}</p>
      )}

      <div className="rounded-xl border border-border bg-surface shadow-card">
        {categorias.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="Nenhuma categoria cadastrada"
            description="Crie categorias para organizar suas entradas e saídas."
          />
        ) : (
          categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: categoria.cor }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-text-primary">
                    {categoria.nome}
                  </p>
                  <p className="truncate text-[11px] text-text-muted">
                    {TIPO_LABELS[categoria.tipo]}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    categoria.ativo
                      ? "bg-income-soft text-income-text"
                      : "bg-neutral-soft text-text-muted"
                  }`}
                >
                  {categoria.ativo ? "Ativa" : "Inativa"}
                </span>

                <Link
                  href={`/categorias/${categoria.id}/editar`}
                  title="Editar"
                  className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  title={
                    categoria.temLancamentos
                      ? "Não é possível excluir: há lançamentos vinculados"
                      : "Excluir"
                  }
                  disabled={categoria.temLancamentos}
                  onClick={() => setCategoriaParaExcluir(categoria)}
                  className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-expense disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-faint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {categoriaParaExcluir && (
        <ConfirmModal
          title="Excluir categoria"
          description={`Tem certeza que deseja excluir "${categoriaParaExcluir.nome}"?`}
          confirmLabel="Excluir"
          onClose={() => setCategoriaParaExcluir(null)}
          onConfirm={() => excluirCategoria(categoriaParaExcluir)}
        />
      )}
    </div>
  );
}
