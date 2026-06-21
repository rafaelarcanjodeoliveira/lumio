-- Lumio — schema inicial
-- Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type tipo_categoria as enum ('entrada', 'saida', 'ambos');
create type tipo_conta as enum ('conta_corrente', 'conta_poupanca', 'carteira', 'cartao_credito', 'investimento', 'outro');
create type tipo_lancamento as enum ('entrada', 'saida');
create type status_lancamento as enum ('realizado', 'provisionado');
create type forma_pagamento as enum ('dinheiro', 'pix', 'debito', 'credito', 'boleto', 'transferencia', 'outro');

-- ---------------------------------------------------------------------------
-- Tabela: profiles (espelha auth.users — ver CLAUDE.md 7.1)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- Cria automaticamente um profile e as categorias padrão (CLAUDE.md §5.5)
-- quando um usuário se cadastra no Supabase Auth.
--
-- `create or replace` para que esta função possa ser reaplicada isoladamente
-- num banco que já rodou uma versão anterior do schema, sem precisar recriar
-- tabelas/trigger existentes.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', new.email), new.email);

  insert into public.categorias (user_id, nome, tipo, cor)
  values
    (new.id, 'Salário', 'entrada', '#27500A'),
    (new.id, 'Freelance', 'entrada', '#3B6D11'),
    (new.id, 'Reembolso', 'entrada', '#5DCAA5'),
    (new.id, 'Investimentos', 'entrada', '#185FA5'),
    (new.id, 'Outros', 'entrada', '#888780'),
    (new.id, 'Moradia', 'saida', '#D85A30'),
    (new.id, 'Alimentação', 'saida', '#F0997B'),
    (new.id, 'Transporte', 'saida', '#EF9F27'),
    (new.id, 'Saúde', 'saida', '#5DCAA5'),
    (new.id, 'Educação', 'saida', '#85B7EB'),
    (new.id, 'Lazer', 'saida', '#D3D1C7'),
    (new.id, 'Assinaturas', 'saida', '#633806'),
    (new.id, 'Cartão de crédito', 'saida', '#791F1F'),
    (new.id, 'Financiamento', 'saida', '#412402'),
    (new.id, 'Impostos', 'saida', '#0C447C'),
    (new.id, 'Outros', 'saida', '#888780');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Tabela: categorias (CLAUDE.md 7.3)
-- ---------------------------------------------------------------------------

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  tipo tipo_categoria not null default 'ambos',
  cor text not null default '#888780',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index categorias_user_id_idx on public.categorias (user_id);

-- ---------------------------------------------------------------------------
-- Tabela: contas (CLAUDE.md 7.4)
-- ---------------------------------------------------------------------------

create table public.contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  tipo tipo_conta not null default 'conta_corrente',
  saldo_inicial numeric(14, 2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index contas_user_id_idx on public.contas (user_id);

-- ---------------------------------------------------------------------------
-- Tabela: lancamentos (CLAUDE.md 7.2)
-- ---------------------------------------------------------------------------

create table public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tipo tipo_lancamento not null,
  status status_lancamento not null default 'realizado',
  descricao text not null,
  valor numeric(14, 2) not null check (valor > 0),
  data date not null,
  data_vencimento date,
  categoria_id uuid references public.categorias (id) on delete set null,
  conta_id uuid references public.contas (id) on delete set null,
  forma_pagamento forma_pagamento,
  observacao text,
  recorrente boolean not null default false,
  -- Agrupa as parcelas/ocorrências geradas a partir de um mesmo lançamento
  -- recorrente ou parcelado (CLAUDE.md 6.5 e 6.6), para edição/exclusão em lote.
  grupo_recorrencia_id uuid,
  parcela_atual integer,
  total_parcelas integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lancamentos_user_id_data_idx on public.lancamentos (user_id, data);
create index lancamentos_categoria_id_idx on public.lancamentos (categoria_id);
create index lancamentos_conta_id_idx on public.lancamentos (conta_id);
create index lancamentos_status_idx on public.lancamentos (status);
create index lancamentos_grupo_recorrencia_idx on public.lancamentos (grupo_recorrencia_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger lancamentos_set_updated_at
  before update on public.lancamentos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — cada usuário só acessa seus próprios dados.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categorias enable row level security;
alter table public.contas enable row level security;
alter table public.lancamentos enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

create policy "categorias: select own" on public.categorias
  for select using (auth.uid() = user_id);
create policy "categorias: insert own" on public.categorias
  for insert with check (auth.uid() = user_id);
create policy "categorias: update own" on public.categorias
  for update using (auth.uid() = user_id);
create policy "categorias: delete own" on public.categorias
  for delete using (auth.uid() = user_id);

create policy "contas: select own" on public.contas
  for select using (auth.uid() = user_id);
create policy "contas: insert own" on public.contas
  for insert with check (auth.uid() = user_id);
create policy "contas: update own" on public.contas
  for update using (auth.uid() = user_id);
create policy "contas: delete own" on public.contas
  for delete using (auth.uid() = user_id);

create policy "lancamentos: select own" on public.lancamentos
  for select using (auth.uid() = user_id);
create policy "lancamentos: insert own" on public.lancamentos
  for insert with check (auth.uid() = user_id);
create policy "lancamentos: update own" on public.lancamentos
  for update using (auth.uid() = user_id);
create policy "lancamentos: delete own" on public.lancamentos
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Categorias padrão sugeridas (CLAUDE.md 5.5) — inserir por usuário após
-- o cadastro, via aplicação (não há seed global porque a tabela é por user_id).
-- ---------------------------------------------------------------------------
