import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(1, "Informe um nome"),
  tipo: z.enum(["entrada", "saida", "ambos"]),
  cor: z.string().min(1, "Escolha uma cor"),
  ativo: z.boolean(),
});

export type CategoriaValues = z.infer<typeof categoriaSchema>;
