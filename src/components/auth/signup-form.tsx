"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    setFormError(null);
    setInfoMessage(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { nome: values.nome } },
    });

    if (error) {
      setFormError(
        error.message === "User already registered"
          ? "Este email já está cadastrado."
          : "Não foi possível criar a conta. Tente novamente.",
      );
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setInfoMessage(
      "Conta criada! Verifique seu email para confirmar antes de entrar.",
    );
  }

  return (
    <Card padding="lg">
      <h1 className="mb-1 text-lg font-semibold tracking-tight text-text-primary">
        Criar conta
      </h1>
      <p className="mb-5 text-[13px] text-text-muted">
        Comece a organizar suas finanças
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome completo" error={errors.nome?.message}>
          <Input type="text" autoComplete="name" {...register("nome")} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Senha" error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
        >
          <Input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </FormField>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}
        {infoMessage && (
          <p className="mb-4 text-[12px] text-income-text">{infoMessage}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-brand-text">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
