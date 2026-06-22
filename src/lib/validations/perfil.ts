import { z } from "zod";

export const perfilSchema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
});

export type PerfilValues = z.infer<typeof perfilSchema>;
