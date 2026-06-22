"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { TIPOS_CONTA } from "@/lib/validations/conta";

type ContaRow = {
  id: string;
  nome: string;
  tipo: (typeof TIPOS_CONTA)[number];
  saldo_inicial: number;
  ativo: boolean;
  temLancamentos: boolean;
};

type ContasListProps = {
  initialContas: ContaRow[];
};

const TIPO_LABELS: Record<ContaRow["tipo"], string> = {
  conta_corrente: "Conta corrente",
  conta_poupanca: "Conta poupança",
  carteira: "Carteira",
  cartao_credito: "Cartão de crédito",
  investimento: "Investimento",
  outro: "Outro",
};

export function ContasList({ initialContas }: ContasListProps) {
  const [contas, setContas] = useState(initialContas);
  const [actionError, setActionError] = useState<string | null>(null);
  const [contaParaExcluir, setContaParaExcluir] = useState<ContaRow | null>(
    null,
  );

  async function excluirConta(conta: ContaRow) {
    setActionError(null);
    setContaParaExcluir(null);

    const supabase = createClient();

    const { count } = await supabase
      .from("lancamentos")
      .select("id", { count: "exact", head: true })
      .eq("conta_id", conta.id);

    if (count && count > 0) {
      setActionError(
        "Não é possível excluir: existem lançamentos vinculados a esta conta.",
      );
      setContas((prev) =>
        prev.map((item) =>
          item.id === conta.id ? { ...item, temLancamentos: true } : item,
        ),
      );
      return;
    }

    const snapshot = contas;
    setContas((prev) => prev.filter((item) => item.id !== conta.id));

    const { error } = await supabase
      .from("contas")
      .delete()
      .eq("id", conta.id);

    if (error) {
      setActionError("Não foi possível excluir a conta.");
      setContas(snapshot);
    }
  }

  return (
    <div>
      {actionError && (
        <p className="mb-3 text-[12px] text-expense">{actionError}</p>
      )}

      <div className="rounded-xl border border-border bg-surface shadow-card">
        {contas.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Nenhuma conta cadastrada"
            description="Cadastre suas contas, carteiras e cartões para começar."
          />
        ) : (
          contas.map((conta) => (
            <div
              key={conta.id}
              className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-text-primary">
                  {conta.nome}
                </p>
                <p className="truncate text-[11px] text-text-muted">
                  {TIPO_LABELS[conta.tipo]} ·{" "}
                  {formatCurrency(conta.saldo_inicial)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    conta.ativo
                      ? "bg-income-soft text-income-text"
                      : "bg-neutral-soft text-text-muted"
                  }`}
                >
                  {conta.ativo ? "Ativa" : "Inativa"}
                </span>

                <Link
                  href={`/contas/${conta.id}/editar`}
                  title="Editar"
                  className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  title={
                    conta.temLancamentos
                      ? "Não é possível excluir: há lançamentos vinculados"
                      : "Excluir"
                  }
                  disabled={conta.temLancamentos}
                  onClick={() => setContaParaExcluir(conta)}
                  className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-expense disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-faint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {contaParaExcluir && (
        <ConfirmModal
          title="Excluir conta"
          description={`Tem certeza que deseja excluir "${contaParaExcluir.nome}"?`}
          confirmLabel="Excluir"
          onClose={() => setContaParaExcluir(null)}
          onConfirm={() => excluirConta(contaParaExcluir)}
        />
      )}
    </div>
  );
}
