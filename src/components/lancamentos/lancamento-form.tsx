"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addMonths, format, parseISO } from "date-fns";
import type { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  FORMAS_PAGAMENTO,
  lancamentoSchema,
  type LancamentoValues,
} from "@/lib/validations/lancamento";
import { FormField, inputClass } from "@/components/ui/form-field";

type LancamentoFormInput = z.input<typeof lancamentoSchema>;

const FORMA_PAGAMENTO_LABELS: Record<(typeof FORMAS_PAGAMENTO)[number], string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Cartão de débito",
  credito: "Cartão de crédito",
  boleto: "Boleto",
  transferencia: "Transferência",
  outro: "Outro",
};

type Categoria = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida" | "ambos";
};

type Conta = {
  id: string;
  nome: string;
};

type LancamentoFormProps = {
  categorias: Categoria[];
  contas: Conta[];
  mode?: "novo" | "editar";
  lancamentoId?: string;
  defaultValues?: Partial<LancamentoFormInput>;
  mes?: number;
  ano?: number;
};

export function LancamentoForm({
  categorias,
  contas,
  mode = "novo",
  lancamentoId,
  defaultValues,
  mes,
  ano,
}: LancamentoFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const lancamentosHref =
    mes && ano ? `/lancamentos?mes=${mes}&ano=${ano}` : "/lancamentos";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LancamentoFormInput, unknown, LancamentoValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: {
      tipo: "saida",
      status: "realizado",
      data: format(new Date(), "yyyy-MM-dd"),
      recorrente: false,
      ...defaultValues,
    },
  });

  const tipoSelecionado = watch("tipo");
  const recorrente = watch("recorrente");

  const categoriasDisponiveis = categorias.filter(
    (categoria) =>
      categoria.tipo === "ambos" || categoria.tipo === tipoSelecionado,
  );

  async function onSubmit(values: LancamentoValues) {
    setFormError(null);
    const supabase = createClient();

    if (mode === "editar") {
      const { error } = await supabase
        .from("lancamentos")
        .update({
          tipo: values.tipo,
          status: values.status,
          data: values.data,
          valor: values.valor,
          descricao: values.descricao,
          categoria_id: values.categoria_id,
          conta_id: values.conta_id,
          forma_pagamento: values.forma_pagamento ?? null,
          observacao: values.observacao || null,
        })
        .eq("id", lancamentoId);

      if (error) {
        setFormError("Não foi possível salvar as alterações. Tente novamente.");
        return;
      }

      router.push(lancamentosHref);
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFormError("Sessão expirada. Faça login novamente.");
      return;
    }

    const baseRecord = {
      user_id: user.id,
      tipo: values.tipo,
      status: values.status,
      descricao: values.descricao,
      categoria_id: values.categoria_id,
      conta_id: values.conta_id,
      forma_pagamento: values.forma_pagamento ?? null,
      observacao: values.observacao || null,
      recorrente: values.recorrente,
    };

    let records: Record<string, unknown>[];

    if (values.recorrente && values.total_parcelas) {
      const totalParcelas = values.total_parcelas;
      const grupoRecorrenciaId = crypto.randomUUID();
      const totalCentavos = Math.round(values.valor * 100);
      const baseCentavos = Math.floor(totalCentavos / totalParcelas);
      const restoCentavos = totalCentavos - baseCentavos * totalParcelas;
      const dataBase = parseISO(values.data);

      records = Array.from({ length: totalParcelas }, (_, index) => {
        const isUltima = index === totalParcelas - 1;
        const valorCentavos = baseCentavos + (isUltima ? restoCentavos : 0);

        return {
          ...baseRecord,
          valor: valorCentavos / 100,
          data: format(addMonths(dataBase, index), "yyyy-MM-dd"),
          parcela_atual: index + 1,
          total_parcelas: totalParcelas,
          grupo_recorrencia_id: grupoRecorrenciaId,
        };
      });
    } else {
      records = [{ ...baseRecord, valor: values.valor, data: values.data }];
    }

    const { error } = await supabase.from("lancamentos").insert(records);

    if (error) {
      setFormError("Não foi possível salvar o lançamento. Tente novamente.");
      return;
    }

    router.push("/lancamentos");
    router.refresh();
  }

  return (
    <div className="max-w-xl rounded-xl border border-border bg-surface p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <FormField label="Tipo" error={errors.tipo?.message}>
            <select className={inputClass} {...register("tipo")}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <select className={inputClass} {...register("status")}>
              <option value="realizado">Realizado</option>
              <option value="provisionado">Provisionado</option>
            </select>
          </FormField>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <FormField label="Data" error={errors.data?.message}>
            <input type="date" className={inputClass} {...register("data")} />
          </FormField>

          <FormField label="Valor" error={errors.valor?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className={inputClass}
              {...register("valor")}
            />
          </FormField>
        </div>

        <FormField label="Descrição" error={errors.descricao?.message}>
          <input
            type="text"
            placeholder="Ex: Aluguel, Mercado, Salário"
            className={inputClass}
            {...register("descricao")}
          />
        </FormField>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <FormField label="Categoria" error={errors.categoria_id?.message}>
            <select
              className={inputClass}
              defaultValue=""
              {...register("categoria_id")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Conta" error={errors.conta_id?.message}>
            <select
              className={inputClass}
              defaultValue=""
              {...register("conta_id")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          label="Forma de pagamento"
          error={errors.forma_pagamento?.message}
        >
          <select
            className={inputClass}
            defaultValue=""
            {...register("forma_pagamento")}
          >
            <option value="">Não informado</option>
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma} value={forma}>
                {FORMA_PAGAMENTO_LABELS[forma]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Observação" error={errors.observacao?.message}>
          <textarea rows={3} className={inputClass} {...register("observacao")} />
        </FormField>

        {mode === "novo" && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <input
                id="recorrente"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                {...register("recorrente")}
              />
              <label
                htmlFor="recorrente"
                className="text-[13px] font-medium text-text-secondary"
              >
                Lançamento parcelado / recorrente
              </label>
            </div>

            {recorrente && (
              <FormField
                label="Total de parcelas"
                error={errors.total_parcelas?.message}
              >
                <input
                  type="number"
                  min="2"
                  step="1"
                  placeholder="Ex: 12"
                  className={inputClass}
                  {...register("total_parcelas")}
                />
              </FormField>
            )}
          </>
        )}

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}

        <div className={mode === "editar" ? "flex gap-2" : undefined}>
          {mode === "editar" && (
            <button
              type="button"
              onClick={() => router.push(lancamentosHref)}
              className="w-full rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-neutral-soft"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-brand-dark disabled:opacity-60"
          >
            {isSubmitting
              ? "Salvando..."
              : mode === "editar"
                ? "Salvar alterações"
                : "Salvar lançamento"}
          </button>
        </div>
      </form>
    </div>
  );
}
