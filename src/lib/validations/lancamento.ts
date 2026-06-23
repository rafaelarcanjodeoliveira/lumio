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
    // "recorrente" é a flag de "repetir lançamento" (nome da coluna no
    // banco); tipo_repeticao decide se a repetição é recorrente ou
    // parcelada, cada uma com seus próprios campos abaixo.
    recorrente: z.boolean(),
    tipo_repeticao: z.enum(["recorrente", "parcelado"]).optional(),
    meses_recorrencia: z.coerce.number().int().optional(),
    total_parcelas: z.coerce.number().int().optional(),
    divisao_valor: z.enum(["dividir", "repetir"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.recorrente) return;

    if (!data.tipo_repeticao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tipo_repeticao"],
        message: "Selecione o tipo de repetição",
      });
      return;
    }

    if (data.tipo_repeticao === "recorrente") {
      if (!data.meses_recorrencia || data.meses_recorrencia < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["meses_recorrencia"],
          message: "Informe por quantos meses (mínimo 1)",
        });
      }
      return;
    }

    if (!data.total_parcelas || data.total_parcelas < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total_parcelas"],
        message: "Informe o número de parcelas (mínimo 2)",
      });
    }

    if (!data.divisao_valor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["divisao_valor"],
        message: "Selecione como dividir o valor",
      });
    }
  });

export type LancamentoValues = z.infer<typeof lancamentoSchema>;
