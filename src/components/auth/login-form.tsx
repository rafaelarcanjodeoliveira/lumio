"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { FormField, inputClass } from "@/components/ui/form-field";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setFormError("Email ou senha inválidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h1 className="mb-1 text-base font-medium text-text-primary">Entrar</h1>
      <p className="mb-5 text-[13px] text-text-muted">
        Acesse seu controle financeiro
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            autoComplete="current-password"
            className={inputClass}
            {...register("password")}
          />
        </FormField>

        {formError && (
          <p className="mb-4 text-[12px] text-expense">{formError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-text-muted">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand-text">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
