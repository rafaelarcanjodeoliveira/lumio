# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Lumio is a personal finance tracker (controle financeiro pessoal). Full product spec, business
rules (saldo atual vs. saldo previsto, recorrência, parcelamento) and data model are documented in
[`docs/CLAUDE.md`](docs/CLAUDE.md) — read it before implementing new domain features or screens.

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth).

## Status do MVP

Implementado: auth completo (`/login`, `/cadastro`, logout, route protection via proxy);
`/lancamentos/novo` (form com parcelamento); `/lancamentos` (listagem com filtros client-side,
edição, exclusão); `/lancamentos/[id]/editar` (preserva mês/ano de origem via searchParams);
`/dashboard` (cards de resumo, evolução diária, gastos por categoria, próximos vencimentos, últimos
lançamentos).

Pendente: `/categorias` e `/contas` ainda são placeholders (CRUD não implementado); sem seed de
categorias padrão para novos usuários; sem deploy configurado na Vercel.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build — also runs the TypeScript check
npm run lint      # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test runner configured in this project yet.

Local setup requires a Supabase project: copy `.env.local.example` to `.env.local` with
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then run `supabase/schema.sql` in the
Supabase SQL editor before the app can read/write data.

## Architecture

### Route groups

- `src/app/(app)/` — authenticated shell. `layout.tsx` renders the `Sidebar` (nav + "Sair" logout)
  around every page: `dashboard`, `lancamentos` (+ `lancamentos/novo` and `lancamentos/[id]/editar`),
  `calendario`, `categorias`, `contas`, `relatorios`, `configuracoes`. `categorias`, `contas`,
  `calendario`, `relatorios`, `configuracoes` are still `components/layout/placeholder-page.tsx`.
- `src/app/(auth)/` — `login` and `cadastro`. `layout.tsx` is a centered, sidebar-less shell with
  `BrandHeader` (logo + tagline).
- `src/app/page.tsx` is just `redirect("/dashboard")` — by the time it runs, the proxy below has
  already sent unauthenticated requests to `/login`, so this only fires for logged-in users.

### Auth / session

- Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` — the file at `src/proxy.ts`
  exports a function named `proxy` (not `middleware`); don't reintroduce a `middleware.ts`.
- `src/proxy.ts` delegates to `updateSession()` in `src/lib/supabase/middleware.ts`, which refreshes
  the Supabase session cookie and enforces route protection: unauthenticated users are redirected to
  `/login` for any non-auth route; authenticated users hitting `/login` or `/cadastro` are redirected
  to `/dashboard`. The proxy `matcher` excludes static/image assets.
- `src/lib/supabase/client.ts` (browser client) and `server.ts` (server components/actions, reads
  cookies via `next/headers`) are separate per `@supabase/ssr` conventions — use the browser client in
  `"use client"` components, the server client in server components/route handlers.
- Auth forms (`components/auth/login-form.tsx`, `signup-form.tsx`) call the Supabase browser client
  directly (`signInWithPassword` / `signUp`) rather than going through a server action. Signup passes
  `options: { data: { nome } }` so the `handle_new_user` Postgres trigger (see schema) populates
  `profiles.nome`; it also branches on whether `signUp` returns a session (email confirmation may be
  enabled on the Supabase project) before redirecting.

### Database (`supabase/schema.sql`)

Source of truth for the schema — apply it manually in the Supabase SQL editor (no migration tool wired
up). Tables: `profiles` (mirrors `auth.users`, auto-created via the `handle_new_user` trigger),
`categorias`, `contas`, `lancamentos`. All are RLS-enabled with `auth.uid() = user_id` policies, so any
Supabase query (client or server) is automatically scoped to the current user — no need to add
`.eq("user_id", ...)` filters manually.

`lancamentos.grupo_recorrencia_id` links rows generated together from one recurring/installment entry
(`parcela_atual` / `total_parcelas` track position). When creating installments client-side, generate
one `crypto.randomUUID()` and reuse it across all generated rows in a single bulk `insert()`; split
`valor` using integer-cent math and put the rounding remainder on the last installment so the parts sum
exactly to the entered total (see `components/lancamentos/lancamento-form.tsx`).

Gotcha: without generated Supabase types (no `supabase gen types` wired up), `.select("*, categorias(nome, cor)")`-style FK joins get inferred as arrays (`{nome,cor}[]`) because the client can't know the
relationship is many-to-one. Use `.returns<T>()` on the query to override the inferred type (see
`app/(app)/dashboard/page.tsx`) rather than casting the result with `as` — a plain `as` fails because
the inferred array type and the real object type don't sufficiently overlap.

### Lançamentos listing (`app/(app)/lancamentos/page.tsx`)

Filtering is client-side: the server page fetches the whole current month (scoped by `?mes=&ano=`
searchParams, default current month) and `LancamentosList` filters tipo/status/categoria/texto in
memory — chosen because monthly volume is low. Changing month pushes a new URL (new server fetch);
the list component is keyed by `${mes}-${ano}` so it remounts cleanly.

Row mutations ("marcar como realizado", excluir) are optimistic: local state updates immediately,
then the Supabase call runs in the background and rolls back on error. Deleting a parcelado row
(`total_parcelas > 1`) opens `ConfirmDeleteModal` with "excluir apenas este" vs. "excluir todas as
parcelas" (the latter deletes by `grupo_recorrencia_id`, unscoped by month). `total_parcelas` is read
straight off the row rather than counted from the loaded list, since other installments may fall
outside the currently-loaded month.

The "editar" link carries the originating `?mes=&ano=` so `LancamentoForm` can redirect back to the
same month instead of dropping the user on the current month after saving/cancelling.

### Dashboard (`app/(app)/dashboard/page.tsx`)

All aggregation logic lives in pure functions in `src/lib/dashboard/calculations.ts` (not in
components), fed by a single month-scoped `lancamentos` query. `saldoAtual` and `saldoPrevisto`
follow docs/CLAUDE.md §6.1/6.2 exactly. Two metrics aren't in that spec and were derived from the
original dashboard mockup — adjust here if the intended formula differs:

- `provisionadoLiquido` = entradas provisionadas − saídas provisionadas.
- `disponivelHoje` = saldoAtual − saídas provisionadas com `data <= hoje` + entradas provisionadas
  com `data <= hoje` (uses `data`, not `data_vencimento`, since the latter isn't populated by any
  form yet).

The evolução diária chart (Recharts stacked `BarChart`) plots one point per calendar day with two
stacked series, `realizado` and `provisionado`, each a *net* (entradas − saídas) for that day and
status — not absolute volume.

### Forms

All forms use `react-hook-form` + `zodResolver` (schemas in `src/lib/validations/`). Shared
`FormField` / `inputClass` live in `src/components/ui/form-field.tsx` (used by both `auth` and
`lancamentos` forms — not auth-specific despite the original location). `LancamentoForm` handles both
create and edit via a `mode: "novo" | "editar"` prop — edit mode hides the recorrente/parcelas
controls (re-splitting an existing installment group isn't supported).

Gotcha: schemas using `z.coerce.number()` (e.g. `lancamento.ts` for `valor`/`total_parcelas`) make
`z.infer` (output) diverge from the raw form input type, which breaks `useForm<T>`'s default generic.
Fix is RHF's 3-generic form: `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>(...)`
— see `lancamento-form.tsx` for the pattern before copying it elsewhere. Same pattern applies to
`z.preprocess` fields: `forma_pagamento` is nullable in the DB, so the schema preprocesses an empty
`""` select value to `undefined` before an optional `z.enum` check, and the form sends `?? null`
(not `undefined`) on submit — `undefined` would get dropped from the request body and silently leave
the column unchanged on an update instead of clearing it.

### Styling

Design tokens are defined as CSS variables in `src/app/globals.css` and exposed to Tailwind via
`@theme inline` (Tailwind v4), e.g. `bg-brand`, `text-income`, `bg-expense-soft`, `border-border`.
Semantic color groups: `brand` (amber, primary actions/active nav), `income` (green), `expense`
(red), `balance` (blue), plus `surface`/`background`/`border`/`text-*` neutrals. Prefer these tokens
over raw Tailwind palette classes to stay consistent with the existing UI.
