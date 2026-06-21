import { z } from "zod";

export const TIPOS_CONTA = [
  "conta_corrente",
  "conta_poupanca",
  "carteira",
  "cartao_credito",
  "investimento",
  "outro",
] as const;

export const contaSchema = z.object({
  nome: z.string().min(1, "Informe um nome"),
  tipo: z.enum(TIPOS_CONTA),
  saldo_inicial: z.coerce.number(),
  ativo: z.boolean(),
});

export type ContaValues = z.infer<typeof contaSchema>;
