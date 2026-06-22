"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Inbox,
  Pencil,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { inputClass } from "@/components/ui/form-field";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDeleteModal } from "@/components/lancamentos/confirm-delete-modal";
import { TransactionCard } from "@/components/lancamentos/transaction-card";

type Categoria = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida" | "ambos";
};

type LancamentoRow = {
  id: string;
  tipo: "entrada" | "saida";
  status: "realizado" | "provisionado";
  descricao: string;
  valor: number;
  data: string;
  categoria_id: string | null;
  grupo_recorrencia_id: string | null;
  parcela_atual: number | null;
  total_parcelas: number | null;
  categorias: { nome: string; cor: string } | null;
  contas: { nome: string } | null;
};

type LancamentosListProps = {
  initialLancamentos: LancamentoRow[];
  categorias: Categoria[];
  mes: number;
  ano: number;
};

export function LancamentosList({
  initialLancamentos,
  categorias,
  mes,
  ano,
}: LancamentosListProps) {
  const router = useRouter();
  const [lancamentos, setLancamentos] = useState(initialLancamentos);
  const [actionError, setActionError] = useState<string | null>(null);

  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">(
    "todos",
  );
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "realizado" | "provisionado"
  >("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroTexto, setFiltroTexto] = useState("");

  const [lancamentoParaExcluir, setLancamentoParaExcluir] =
    useState<LancamentoRow | null>(null);

  const referencia = new Date(ano, mes - 1, 1);
  const mesLabel = format(referencia, "MMMM yyyy", { locale: ptBR });

  function irParaMes(delta: number) {
    const novaData = addMonths(referencia, delta);
    router.push(
      `/lancamentos?mes=${novaData.getMonth() + 1}&ano=${novaData.getFullYear()}`,
    );
  }

  const lancamentosFiltrados = useMemo(() => {
    const textoBusca = filtroTexto.trim().toLowerCase();

    return lancamentos.filter((lancamento) => {
      if (filtroTipo !== "todos" && lancamento.tipo !== filtroTipo) {
        return false;
      }
      if (filtroStatus !== "todos" && lancamento.status !== filtroStatus) {
        return false;
      }
      if (
        filtroCategoria !== "todos" &&
        lancamento.categoria_id !== filtroCategoria
      ) {
        return false;
      }
      if (textoBusca && !lancamento.descricao.toLowerCase().includes(textoBusca)) {
        return false;
      }
      return true;
    });
  }, [lancamentos, filtroTipo, filtroStatus, filtroCategoria, filtroTexto]);

  async function marcarComoRealizado(lancamento: LancamentoRow) {
    setActionError(null);
    setLancamentos((prev) =>
      prev.map((item) =>
        item.id === lancamento.id ? { ...item, status: "realizado" } : item,
      ),
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("lancamentos")
      .update({ status: "realizado" })
      .eq("id", lancamento.id);

    if (error) {
      setActionError("Não foi possível atualizar o lançamento.");
      setLancamentos((prev) =>
        prev.map((item) => (item.id === lancamento.id ? lancamento : item)),
      );
    }
  }

  async function excluirLancamento(
    alvo: LancamentoRow,
    scope: "este" | "grupo",
  ) {
    setActionError(null);
    setLancamentoParaExcluir(null);

    const snapshot = lancamentos;
    const removerPorGrupo = scope === "grupo" && alvo.grupo_recorrencia_id;
    const idsRemovidos = removerPorGrupo
      ? lancamentos
          .filter((item) => item.grupo_recorrencia_id === alvo.grupo_recorrencia_id)
          .map((item) => item.id)
      : [alvo.id];

    setLancamentos((prev) =>
      prev.filter((item) => !idsRemovidos.includes(item.id)),
    );

    const supabase = createClient();
    const { error } = removerPorGrupo
      ? await supabase
          .from("lancamentos")
          .delete()
          .eq("grupo_recorrencia_id", alvo.grupo_recorrencia_id as string)
      : await supabase.from("lancamentos").delete().eq("id", alvo.id);

    if (error) {
      setActionError("Não foi possível excluir o lançamento.");
      setLancamentos(snapshot);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => irParaMes(-1)}
            className="rounded-md border border-border p-1.5 text-text-muted hover:bg-neutral-soft"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[130px] text-center text-[13px] font-medium text-text-primary capitalize">
            {mesLabel}
          </span>
          <button
            type="button"
            onClick={() => irParaMes(1)}
            className="rounded-md border border-border p-1.5 text-text-muted hover:bg-neutral-soft"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select
          className={inputClass}
          value={filtroTipo}
          onChange={(event) =>
            setFiltroTipo(event.target.value as typeof filtroTipo)
          }
        >
          <option value="todos">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <select
          className={inputClass}
          value={filtroStatus}
          onChange={(event) =>
            setFiltroStatus(event.target.value as typeof filtroStatus)
          }
        >
          <option value="todos">Todos os status</option>
          <option value="realizado">Realizado</option>
          <option value="provisionado">Provisionado</option>
        </select>

        <select
          className={inputClass}
          value={filtroCategoria}
          onChange={(event) => setFiltroCategoria(event.target.value)}
        >
          <option value="todos">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por descrição"
          className={inputClass}
          value={filtroTexto}
          onChange={(event) => setFiltroTexto(event.target.value)}
        />
      </div>

      {actionError && (
        <p className="mb-3 text-[12px] text-expense">{actionError}</p>
      )}

      <div className="rounded-xl border border-border bg-surface shadow-card">
        {lancamentosFiltrados.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nenhum lançamento encontrado"
            description="Ajuste os filtros ou cadastre um novo lançamento para este período."
          />
        ) : (
          lancamentosFiltrados.map((lancamento) => (
            <TransactionCard
              key={lancamento.id}
              descricao={lancamento.descricao}
              categoriaNome={lancamento.categorias?.nome}
              categoriaCor={lancamento.categorias?.cor}
              data={lancamento.data}
              tipo={lancamento.tipo}
              status={lancamento.status}
              valor={lancamento.valor}
              parcelaInfo={
                lancamento.total_parcelas
                  ? `${lancamento.parcela_atual}/${lancamento.total_parcelas}`
                  : undefined
              }
              actions={
                <>
                  {lancamento.status === "provisionado" && (
                    <button
                      type="button"
                      title="Marcar como realizado"
                      onClick={() => marcarComoRealizado(lancamento)}
                      className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-income-text"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  <Link
                    href={`/lancamentos/${lancamento.id}/editar?mes=${mes}&ano=${ano}`}
                    title="Editar"
                    className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    title="Excluir"
                    onClick={() => setLancamentoParaExcluir(lancamento)}
                    className="rounded-md p-1.5 text-text-faint hover:bg-neutral-soft hover:text-expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              }
            />
          ))
        )}
      </div>

      {lancamentoParaExcluir && (
        <ConfirmDeleteModal
          totalParcelas={lancamentoParaExcluir.total_parcelas}
          onClose={() => setLancamentoParaExcluir(null)}
          onConfirm={(scope) => excluirLancamento(lancamentoParaExcluir, scope)}
        />
      )}
    </div>
  );
}
