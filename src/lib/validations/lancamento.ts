import { z } from "zod";

export const FORMAS_PAGAMENTO = [
  "dinheiro",
  "pix",
  "debito",
  "credito",
  "boleto",
  "transferencia",
  "outro",
] as const;

export const lancamentoSchema = z
  .object({
    tipo: z.enum(["entrada", "saida"]),
    status: z.enum(["realizado", "provisionado"]),
    data: z.string().min(1, "Informe a data"),
    valor: z.coerce.number().positive("Informe um valor maior que zero"),
    descricao: z.string().min(1, "Informe uma descrição"),
    categoria_id: z.string().min(1, "Selecione uma categoria"),
    conta_id: z.string().min(1, "Selecione uma conta"),
    // Coluna nullable no banco — "" do <select> em branco é normalizado para
    // undefined antes de validar, em vez de exigir uma das opções do enum.
    forma_pagamento: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(FORMAS_PAGAMENTO).optional(),
    ),
    observacao: z.string().optional(),
    recorrente: z.boolean(),
    total_parcelas: z.coerce.number().int().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recorrente && (!data.total_parcelas || data.total_parcelas < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total_parcelas"],
        message: "Informe o número de parcelas (mínimo 2)",
      });
    }
  });

export type LancamentoValues = z.infer<typeof lancamentoSchema>;
