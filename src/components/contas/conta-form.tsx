"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  TIPOS_CONTA,
  contaSchema,
  type ContaValues,
} from "@/lib/validations/conta";
import { FormField, inputClass } from "@/components/ui/form-field";

type ContaFormInput = z.input<typeof contaSchema>;

const TIPO_CONTA_LABELS: Record<(typeof TIPOS_CONTA)[number], string> = {
  conta_corrente: "Conta corrente",
  conta_poupanca: "Conta poupança",
  carteira: "Carteira",
  cartao_credito: "Cartão de crédito",
  investimento: "Investimento",
  outro: "Outro",
};

type ContaFormProps = {
  mode?: "novo" | "editar";
  contaId?: string;
  defaultValues?: Partial<ContaFormInput>;
};

export function ContaForm({
  mode = "novo",
  contaId,
  defaultValues,
}: ContaFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContaFormInput, unknown, ContaValues>({
    resolver: zodResolver(contaSchema),
    defaultValues: {
      nome: "",
      tipo: "conta_corrente",
      saldo_inicial: 0,
      ativo: true,
      ...defaultValues,
    },
  });

  async function onSubmit(values: ContaValues) {
    setFormError(null);
    const supabase = createClient();

    if (mode === "editar") {
      const { error } = await supabase
        .from("contas")
        .update(values)
        .eq("id", contaId);

      if (error) {
        setFormError(
          "Não foi possível salvar as alterações. Tente novamente.",
        );
        return;
      }
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFormError("Sessão expirada. Faça login novamente.");
        return;
      }

      const { error } = await supabase
        .from("contas")
        .insert({ ...values, user_id: user.id });

      if (error) {
        setFormError("Não foi possível salvar a conta. Tente novamente.");
        return;
      }
    }

    router.push("/contas");
    router.refresh();
  }

  return (
    <div className="max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome" error={errors.nome?.message}>
          <input type="text" className={inputClass} {...register("nome")} />
        </FormField>

        <FormField label="Tipo" error={errors.tipo?.message}>
          <select className={inputClass} {...register("tipo")}>
            {TIPOS_CONTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_CONTA_LABELS[tipo]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Saldo inicial" error={errors.saldo_inicial?.message}>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            {...register("saldo_inicial")}
          />
        </FormField>

        <div className="mb-4 flex items-center gap-2">
          <input
            id="ativo"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
            {...register("ativo")}
          />
          <label
            htmlFor="ativo"
            className="text-[13px] font-medium text-text-secondary"
          >
            Conta ativa
          </label>
        </div>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/contas")}
            className="w-full rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-neutral-soft"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-brand-dark disabled:opacity-60"
          >
            {isSubmitting
              ? "Salvando..."
              : mode === "editar"
                ? "Salvar alterações"
                : "Criar conta"}
          </button>
        </div>
      </form>
    </div>
  );
}
