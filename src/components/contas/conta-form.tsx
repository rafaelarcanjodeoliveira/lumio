"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  TIPOS_CONTA,
  contaSchema,
  type ContaValues,
} from "@/lib/validations/conta";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFormError("Sessão expirada. Faça login novamente.");
      return;
    }

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

      // Normaliza o lançamento de saldo inicial: remove o anterior e recria
      // com o valor atual, se aplicável — mais simples do que tentar ajustar
      // o registro existente.
      await supabase
        .from("lancamentos")
        .delete()
        .eq("conta_id", contaId)
        .ilike("descricao", "Saldo inicial —%");

      if (values.saldo_inicial > 0) {
        await supabase.from("lancamentos").insert({
          user_id: user.id,
          tipo: "entrada",
          status: "realizado",
          descricao: `Saldo inicial — ${values.nome}`,
          valor: values.saldo_inicial,
          data: format(new Date(), "yyyy-MM-dd"),
          conta_id: contaId,
          categoria_id: null,
        });
      }
    } else {
      const { data: novaConta, error } = await supabase
        .from("contas")
        .insert({ ...values, user_id: user.id })
        .select("id")
        .single();

      if (error || !novaConta) {
        setFormError("Não foi possível salvar a conta. Tente novamente.");
        return;
      }

      if (values.saldo_inicial > 0) {
        await supabase.from("lancamentos").insert({
          user_id: user.id,
          tipo: "entrada",
          status: "realizado",
          descricao: `Saldo inicial — ${values.nome}`,
          valor: values.saldo_inicial,
          data: format(new Date(), "yyyy-MM-dd"),
          conta_id: novaConta.id,
          categoria_id: null,
        });
      }
    }

    router.push("/contas");
    router.refresh();
  }

  return (
    <Card padding="lg" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome" error={errors.nome?.message}>
          <Input type="text" {...register("nome")} />
        </FormField>

        <FormField label="Tipo" error={errors.tipo?.message}>
          <Select {...register("tipo")}>
            {TIPOS_CONTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_CONTA_LABELS[tipo]}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Saldo inicial" error={errors.saldo_inicial?.message}>
          <Input type="number" step="0.01" {...register("saldo_inicial")} />
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
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/contas")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : mode === "editar"
                ? "Salvar alterações"
                : "Criar conta"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
