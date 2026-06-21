import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu email").email("Email inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    nome: z.string().min(2, "Informe seu nome completo"),
    email: z.string().min(1, "Informe seu email").email("Email inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof signupSchema>;
