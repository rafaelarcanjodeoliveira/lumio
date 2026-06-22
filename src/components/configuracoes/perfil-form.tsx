"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { perfilSchema, type PerfilValues } from "@/lib/validations/perfil";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Card padding="lg" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome" error={errors.nome?.message}>
          <Input type="text" {...register("nome")} />
        </FormField>

        <FormField label="Email">
          <Input
            type="email"
            value={email}
            disabled
            readOnly
            className="bg-neutral-soft text-text-muted"
          />
        </FormField>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}
        {formSuccess && (
          <p className="mb-4 text-[12px] text-income-text">{formSuccess}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>

      <div className="mt-6 border-t border-border-soft pt-5">
        <p className="mb-1 text-[13px] font-medium text-text-secondary">
          Senha
        </p>
        <p className="mb-3 text-[12px] text-text-muted">
          Enviaremos um link por email para você definir uma nova senha.
        </p>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAlterarSenha}
          disabled={senhaStatus === "enviando"}
        >
          {senhaStatus === "enviando" ? "Enviando..." : "Alterar senha"}
        </Button>

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
    </Card>
  );
}
