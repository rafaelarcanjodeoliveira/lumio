# Lumio

Controle financeiro pessoal. Stack: Next.js (App Router), TypeScript, Tailwind CSS, Supabase.

Especificação completa do produto em [`docs/CLAUDE.md`](docs/CLAUDE.md).

## Rodando localmente

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie `.env.local.example` para `.env.local` e preencha com a URL e a anon key do seu projeto (Project Settings → API).
3. Aplique o schema do banco: abra o SQL Editor do Supabase e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
4. Instale as dependências e inicie o servidor:

   ```bash
   npm install
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

- `src/app/(app)` — shell autenticado (sidebar + páginas: dashboard, lançamentos, calendário, categorias, contas, relatórios, configurações).
- `src/components/layout` — sidebar, topbar e placeholder de página.
- `src/lib/supabase` — clients de browser/server e helper de sessão usado em `src/proxy.ts`.
- `supabase/schema.sql` — tabelas, enums, RLS e triggers.
