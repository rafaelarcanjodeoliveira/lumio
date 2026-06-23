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
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      divisao_valor: "dividir",
      ...defaultValues,
    },
  });

  const tipoSelecionado = watch("tipo");
  const recorrente = watch("recorrente");
  const tipoRepeticao = watch("tipo_repeticao");

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
      categoria_id: values.categoria_id,
      conta_id: values.conta_id,
      forma_pagamento: values.forma_pagamento ?? null,
      observacao: values.observacao || null,
      recorrente: values.recorrente,
    };

    let records: Record<string, unknown>[];

    if (values.recorrente && values.tipo_repeticao === "recorrente" && values.meses_recorrencia) {
      // Recorrente: N lançamentos com o MESMO valor, sem sufixo na descrição.
      const totalParcelas = values.meses_recorrencia;
      const grupoRecorrenciaId = crypto.randomUUID();
      const dataBase = parseISO(values.data);

      records = Array.from({ length: totalParcelas }, (_, index) => ({
        ...baseRecord,
        descricao: values.descricao,
        valor: values.valor,
        data: format(addMonths(dataBase, index), "yyyy-MM-dd"),
        parcela_atual: index + 1,
        total_parcelas: totalParcelas,
        grupo_recorrencia_id: grupoRecorrenciaId,
      }));
    } else if (
      values.recorrente &&
      values.tipo_repeticao === "parcelado" &&
      values.total_parcelas
    ) {
      // Parcelado: cada parcela leva o sufixo "(X/N)" na descrição. O valor
      // por parcela depende da escolha do usuário — dividir o total (com
      // matemática em centavos, resto na última parcela) ou repetir o
      // valor informado em cada parcela (total = valor × N).
      const totalParcelas = values.total_parcelas;
      const grupoRecorrenciaId = crypto.randomUUID();
      const dataBase = parseISO(values.data);

      let valoresCentavos: number[];

      if (values.divisao_valor === "repetir") {
        const valorCentavos = Math.round(values.valor * 100);
        valoresCentavos = Array.from(
          { length: totalParcelas },
          () => valorCentavos,
        );
      } else {
        const totalCentavos = Math.round(values.valor * 100);
        const baseCentavos = Math.floor(totalCentavos / totalParcelas);
        const restoCentavos = totalCentavos - baseCentavos * totalParcelas;
        valoresCentavos = Array.from({ length: totalParcelas }, (_, index) =>
          index === totalParcelas - 1
            ? baseCentavos + restoCentavos
            : baseCentavos,
        );
      }

      records = valoresCentavos.map((valorCentavos, index) => ({
        ...baseRecord,
        descricao: `${values.descricao} (${index + 1}/${totalParcelas})`,
        valor: valorCentavos / 100,
        data: format(addMonths(dataBase, index), "yyyy-MM-dd"),
        parcela_atual: index + 1,
        total_parcelas: totalParcelas,
        grupo_recorrencia_id: grupoRecorrenciaId,
      }));
    } else {
      records = [
        {
          ...baseRecord,
          descricao: values.descricao,
          valor: values.valor,
          data: values.data,
        },
      ];
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
    <Card padding="lg" className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Tipo" error={errors.tipo?.message}>
            <Select {...register("tipo")}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </Select>
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <Select {...register("status")}>
              <option value="realizado">Realizado</option>
              <option value="provisionado">Provisionado</option>
            </Select>
          </FormField>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Data" error={errors.data?.message}>
            <Input type="date" {...register("data")} />
          </FormField>

          <FormField label="Valor" error={errors.valor?.message}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("valor")}
            />
          </FormField>
        </div>

        <FormField label="Descrição" error={errors.descricao?.message}>
          <Input
            type="text"
            placeholder="Ex: Aluguel, Mercado, Salário"
            {...register("descricao")}
          />
        </FormField>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Categoria" error={errors.categoria_id?.message}>
            <Select defaultValue="" {...register("categoria_id")}>
              <option value="" disabled>
                Selecione
              </option>
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Conta" error={errors.conta_id?.message}>
            <Select defaultValue="" {...register("conta_id")}>
              <option value="" disabled>
                Selecione
              </option>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField
          label="Forma de pagamento"
          error={errors.forma_pagamento?.message}
        >
          <Select defaultValue="" {...register("forma_pagamento")}>
            <option value="">Não informado</option>
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma} value={forma}>
                {FORMA_PAGAMENTO_LABELS[forma]}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Observação" error={errors.observacao?.message}>
          <Textarea rows={3} {...register("observacao")} />
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
                Repetir lançamento
              </label>
            </div>

            {recorrente && (
              <>
                <FormField
                  label="Tipo de repetição"
                  error={errors.tipo_repeticao?.message}
                >
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <input
                        type="radio"
                        value="recorrente"
                        className="h-4 w-4 border-border text-brand focus:ring-brand"
                        {...register("tipo_repeticao")}
                      />
                      Recorrente
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <input
                        type="radio"
                        value="parcelado"
                        className="h-4 w-4 border-border text-brand focus:ring-brand"
                        {...register("tipo_repeticao")}
                      />
                      Parcelado
                    </label>
                  </div>
                </FormField>

                {tipoRepeticao === "recorrente" && (
                  <FormField
                    label="Por quantos meses?"
                    error={errors.meses_recorrencia?.message}
                  >
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ex: 12"
                      {...register("meses_recorrencia")}
                    />
                  </FormField>
                )}

                {tipoRepeticao === "parcelado" && (
                  <>
                    <FormField
                      label="Número de parcelas"
                      error={errors.total_parcelas?.message}
                    >
                      <Input
                        type="number"
                        min="2"
                        step="1"
                        placeholder="Ex: 3"
                        {...register("total_parcelas")}
                      />
                    </FormField>

                    <FormField
                      label="Valor por parcela"
                      error={errors.divisao_valor?.message}
                    >
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[13px] text-text-secondary">
                          <input
                            type="radio"
                            value="dividir"
                            className="h-4 w-4 border-border text-brand focus:ring-brand"
                            {...register("divisao_valor")}
                          />
                          Dividir valor total (valor ÷ parcelas)
                        </label>
                        <label className="flex items-center gap-2 text-[13px] text-text-secondary">
                          <input
                            type="radio"
                            value="repetir"
                            className="h-4 w-4 border-border text-brand focus:ring-brand"
                            {...register("divisao_valor")}
                          />
                          Mesmo valor em cada parcela (valor × parcelas)
                        </label>
                      </div>
                    </FormField>
                  </>
                )}
              </>
            )}
          </>
        )}

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}

        <div className={mode === "editar" ? "flex gap-2" : undefined}>
          {mode === "editar" && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(lancamentosHref)}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : mode === "editar"
                ? "Salvar alterações"
                : "Salvar lançamento"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
