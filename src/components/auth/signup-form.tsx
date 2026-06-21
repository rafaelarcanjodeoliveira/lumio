"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";
import { FormField, inputClass } from "@/components/ui/form-field";

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
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h1 className="mb-1 text-base font-medium text-text-primary">
        Criar conta
      </h1>
      <p className="mb-5 text-[13px] text-text-muted">
        Comece a organizar suas finanças
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nome completo" error={errors.nome?.message}>
          <input
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register("nome")}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
        </FormField>

        <FormField label="Senha" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className={inputClass}
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            className={inputClass}
            {...register("confirmPassword")}
          />
        </FormField>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}
        {infoMessage && (
          <p className="mb-4 text-[12px] text-income-text">{infoMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-brand-text">
          Entrar
        </Link>
      </p>
    </div>
  );
}
