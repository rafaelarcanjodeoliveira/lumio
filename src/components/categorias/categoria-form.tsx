"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  categoriaSchema,
  type CategoriaValues,
} from "@/lib/validations/categoria";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type CategoriaFormProps = {
  mode?: "novo" | "editar";
  categoriaId?: string;
  defaultValues?: Partial<CategoriaValues>;
};

export function CategoriaForm({
  mode = "novo",
  categoriaId,
  defaultValues,
}: CategoriaFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: "",
      tipo: "ambos",
      cor: "#888780",
      ativo: true,
      ...defaultValues,
    },
  });

  async function onSubmit(values: CategoriaValues) {
    setFormError(null);
    const supabase = createClient();

    if (mode === "editar") {
      const { error } = await supabase
        .from("categorias")
        .update(values)
        .eq("id", categoriaId);

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
        .from("categorias")
        .insert({ ...values, user_id: user.id });

      if (error) {
        setFormError("Não foi possível salvar a categoria. Tente novamente.");
        return;
      }
    }

    router.push("/categorias");
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
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ambos">Ambos</option>
          </Select>
        </FormField>

        <FormField label="Cor" error={errors.cor?.message}>
          <input
            type="color"
            className="h-10 w-20 rounded-lg border border-border bg-surface p-1"
            {...register("cor")}
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
            Categoria ativa
          </label>
        </div>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/categorias")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : mode === "editar"
                ? "Salvar alterações"
                : "Criar categoria"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
