"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { perfilSchema, type PerfilValues } from "@/lib/validations/perfil";
import { FormField, inputClass } from "@/components/ui/form-field";

type PerfilFormProps = {
  userId: string;
  nome: string;
  email: string;
};

export function PerfilForm({ userId, nome, email }: PerfilFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [senhaStatus, setSenhaStatus] = useState<
    "idle" | "enviando" | "enviado" | "erro"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nome },
  });

  async function onSubmit(values: PerfilValues) {
    setFormError(null);
    setFormSuccess(null);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({ nome: values.nome })
      .eq("id", userId);

    if (error) {
      setFormError("Não foi possível salvar as alterações. Tente novamente.");
      return;
    }

    setFormSuccess("Nome atualizado com sucesso.");
    router.refresh();
  }

  async function handleAlterarSenha() {
    setSenhaStatus("enviando");
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setSenhaStatus(error ? "erro" : "enviado");
  }

  return (
    <div className="max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome" error={errors.nome?.message}>
          <input type="text" className={inputClass} {...register("nome")} />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            value={email}
            disabled
            readOnly
            className={`${inputClass} cursor-not-allowed bg-neutral-soft text-text-muted`}
          />
        </FormField>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}
        {formSuccess && (
          <p className="mb-4 text-[12px] text-income-text">{formSuccess}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <div className="mt-6 border-t border-border-soft pt-5">
        <p className="mb-1 text-[13px] font-medium text-text-secondary">
          Senha
        </p>
        <p className="mb-3 text-[12px] text-text-muted">
          Enviaremos um link por email para você definir uma nova senha.
        </p>

        <button
          type="button"
          onClick={handleAlterarSenha}
          disabled={senhaStatus === "enviando"}
          className="w-full rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-neutral-soft disabled:opacity-60"
        >
          {senhaStatus === "enviando" ? "Enviando..." : "Alterar senha"}
        </button>

        {senhaStatus === "enviado" && (
          <p className="mt-2 text-[12px] text-income-text">
            Email enviado. Verifique sua caixa de entrada.
          </p>
        )}
        {senhaStatus === "erro" && (
          <p className="mt-2 text-[12px] text-expense">
            Não foi possível enviar o email. Tente novamente.
          </p>
        )}
      </div>
    </div>
  );
}
